begin;

create table if not exists public.document_categories (
	id uuid primary key default gen_random_uuid(),
	slug text not null unique,
	title text not null,
	description text null,
	sort_order integer not null default 0,
	active boolean not null default true,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint document_categories_slug_format
		check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$')
);

create table if not exists public.corporate_documents (
	id uuid primary key default gen_random_uuid(),
	category_id uuid not null references public.document_categories(id) on delete restrict,
	slug text not null unique,
	title text not null,
	summary text null,
	responsible_department text null,
	status text not null default 'draft',
	current_version_id uuid null,
	sort_order integer not null default 0,
	published_at timestamptz null,
	created_by uuid null references auth.users(id) on delete set null,
	updated_by uuid null references auth.users(id) on delete set null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	deleted_at timestamptz null,
	constraint corporate_documents_slug_format
		check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
	constraint corporate_documents_status_check
		check (status in ('draft', 'published', 'archived')),
	constraint corporate_documents_published_requires_current_version
		check (status <> 'published' or current_version_id is not null)
);

create table if not exists public.corporate_document_versions (
	id uuid primary key default gen_random_uuid(),
	document_id uuid not null references public.corporate_documents(id) on delete restrict,
	version_label text not null,
	effective_date date null,
	revision_date date null,
	storage_path text not null unique,
	original_filename text not null,
	public_filename text not null,
	mime_type text not null,
	file_size bigint not null,
	checksum_sha256 text not null,
	state text not null default 'draft',
	published_at timestamptz null,
	superseded_at timestamptz null,
	created_by uuid null references auth.users(id) on delete set null,
	created_at timestamptz not null default now(),
	constraint corporate_document_versions_label_unique
		unique (document_id, version_label),
	constraint corporate_document_versions_document_id_id_unique
		unique (document_id, id),
	constraint corporate_document_versions_pdf_mime_type
		check (mime_type = 'application/pdf'),
	constraint corporate_document_versions_positive_file_size
		check (file_size > 0),
	constraint corporate_document_versions_checksum_sha256_format
		check (checksum_sha256 ~ '^[a-f0-9]{64}$'),
	constraint corporate_document_versions_state_check
		check (state in ('draft', 'current', 'superseded', 'archived')),
	constraint corporate_document_versions_public_filename_pdf
		check (public_filename ~ '^[A-Za-z0-9][A-Za-z0-9._-]*\.pdf$'),
	constraint corporate_document_versions_storage_path_pdf
		check (storage_path ~ '^[a-z0-9][a-z0-9._/-]*\.pdf$')
);

create unique index if not exists corporate_document_versions_one_current_per_document
	on public.corporate_document_versions (document_id)
	where state = 'current';

alter table public.corporate_documents
	drop constraint if exists corporate_documents_current_version_same_document;

alter table public.corporate_documents
	add constraint corporate_documents_current_version_same_document
	foreign key (id, current_version_id)
	references public.corporate_document_versions(document_id, id)
	deferrable initially deferred;

comment on table public.document_categories is
	'Shared categories for Criasett public corporate documents such as policies, certifications and compliance records.';

comment on table public.corporate_documents is
	'Canonical corporate document records. current_version_id points to the approved immutable public version.';

comment on table public.corporate_document_versions is
	'Immutable PDF version records stored in the private corporate-documents bucket.';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
	new.updated_at = now();
	return new;
end;
$$;

drop trigger if exists document_categories_set_updated_at on public.document_categories;
create trigger document_categories_set_updated_at
	before update on public.document_categories
	for each row
	execute function public.set_updated_at();

drop trigger if exists corporate_documents_set_updated_at on public.corporate_documents;
create trigger corporate_documents_set_updated_at
	before update on public.corporate_documents
	for each row
	execute function public.set_updated_at();

create or replace function public.prevent_corporate_document_version_overwrite()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
	if old.state <> 'draft' and (
		old.document_id is distinct from new.document_id
		or old.version_label is distinct from new.version_label
		or old.effective_date is distinct from new.effective_date
		or old.revision_date is distinct from new.revision_date
		or old.storage_path is distinct from new.storage_path
		or old.original_filename is distinct from new.original_filename
		or old.public_filename is distinct from new.public_filename
		or old.mime_type is distinct from new.mime_type
		or old.file_size is distinct from new.file_size
		or old.checksum_sha256 is distinct from new.checksum_sha256
		or old.published_at is distinct from new.published_at
		or old.created_by is distinct from new.created_by
		or old.created_at is distinct from new.created_at
	) then
		raise exception 'approved document versions are immutable';
	end if;

	if old.state in ('superseded', 'archived') and new.state not in ('superseded', 'archived') then
		raise exception 'historical document versions cannot become draft or current';
	end if;

	return new;
end;
$$;

drop trigger if exists corporate_document_versions_prevent_overwrite on public.corporate_document_versions;
create trigger corporate_document_versions_prevent_overwrite
	before update on public.corporate_document_versions
	for each row
	execute function public.prevent_corporate_document_version_overwrite();

create or replace function public.prevent_approved_corporate_document_version_delete()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
	if old.state <> 'draft' then
		raise exception 'approved document versions cannot be deleted';
	end if;

	if exists (
		select 1
		from public.corporate_documents
		where current_version_id = old.id
	) then
		raise exception 'current document versions cannot be deleted';
	end if;

	return old;
end;
$$;

drop trigger if exists corporate_document_versions_prevent_approved_delete on public.corporate_document_versions;
create trigger corporate_document_versions_prevent_approved_delete
	before delete on public.corporate_document_versions
	for each row
	execute function public.prevent_approved_corporate_document_version_delete();

create or replace function public.validate_corporate_document_integrity()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
	if new.status = 'published' then
		if new.deleted_at is not null then
			raise exception 'deleted documents cannot be published';
		end if;

		if new.published_at is null then
			raise exception 'published documents must have published_at';
		end if;

		if new.current_version_id is null then
			raise exception 'published documents must have a current version';
		end if;

		if not exists (
			select 1
			from public.corporate_document_versions version
			where version.id = new.current_version_id
				and version.document_id = new.id
				and version.state = 'current'
				and version.published_at is not null
		) then
			raise exception 'published documents must reference a current published version';
		end if;
	end if;

	return null;
end;
$$;

drop trigger if exists corporate_documents_validate_integrity on public.corporate_documents;
create constraint trigger corporate_documents_validate_integrity
	after insert or update on public.corporate_documents
	deferrable initially deferred
	for each row
	execute function public.validate_corporate_document_integrity();

create or replace function public.validate_corporate_document_version_integrity()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
	if new.state = 'current' and not exists (
		select 1
		from public.corporate_documents document
		where document.id = new.document_id
			and document.current_version_id = new.id
			and document.status = 'published'
			and document.deleted_at is null
	) then
		raise exception 'current versions must be the selected version for a published document';
	end if;

	if new.state = 'current' and new.published_at is null then
		raise exception 'current versions must have published_at';
	end if;

	return null;
end;
$$;

drop trigger if exists corporate_document_versions_validate_integrity on public.corporate_document_versions;
create constraint trigger corporate_document_versions_validate_integrity
	after insert or update on public.corporate_document_versions
	deferrable initially deferred
	for each row
	execute function public.validate_corporate_document_version_integrity();

create or replace function public.publish_corporate_document_version(
	p_document_id uuid,
	p_version_id uuid
)
returns public.corporate_documents
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
	v_document public.corporate_documents%rowtype;
	v_version public.corporate_document_versions%rowtype;
	v_now timestamptz := now();
begin
	if auth.uid() is null or not public.is_admin() then
		raise exception 'administrator access required';
	end if;

	select *
	into v_document
	from public.corporate_documents
	where id = p_document_id
	for update;

	if not found then
		raise exception 'document not found';
	end if;

	if v_document.deleted_at is not null then
		raise exception 'deleted documents cannot be published';
	end if;

	select *
	into v_version
	from public.corporate_document_versions
	where id = p_version_id
		and document_id = p_document_id
	for update;

	if not found then
		raise exception 'document version not found';
	end if;

	if v_version.state not in ('draft', 'current') then
		raise exception 'only draft or current versions can be published';
	end if;

	if v_version.mime_type <> 'application/pdf' then
		raise exception 'only PDF versions can be published';
	end if;

	if v_version.file_size <= 0 then
		raise exception 'document version file_size must be positive';
	end if;

	if v_version.checksum_sha256 !~ '^[a-f0-9]{64}$' then
		raise exception 'document version checksum must be SHA-256 hex';
	end if;

	if not exists (
		select 1
		from storage.objects object
		where object.bucket_id = 'corporate-documents'
			and object.name = v_version.storage_path
	) then
		raise exception 'document version storage object not found';
	end if;

	update public.corporate_document_versions
	set state = 'superseded',
		superseded_at = coalesce(superseded_at, v_now)
	where document_id = p_document_id
		and id <> p_version_id
		and state = 'current';

	update public.corporate_document_versions
	set state = 'current',
		published_at = coalesce(published_at, v_now),
		superseded_at = null
	where id = p_version_id;

	update public.corporate_documents
	set current_version_id = p_version_id,
		status = 'published',
		published_at = coalesce(published_at, v_now),
		updated_by = auth.uid(),
		updated_at = v_now
	where id = p_document_id
	returning *
	into v_document;

	return v_document;
end;
$$;

create or replace function public.archive_corporate_document(p_document_id uuid)
returns public.corporate_documents
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
	v_document public.corporate_documents%rowtype;
	v_now timestamptz := now();
begin
	if auth.uid() is null or not public.is_admin() then
		raise exception 'administrator access required';
	end if;

	select *
	into v_document
	from public.corporate_documents
	where id = p_document_id
	for update;

	if not found then
		raise exception 'document not found';
	end if;

	update public.corporate_document_versions
	set state = 'archived',
		superseded_at = coalesce(superseded_at, v_now)
	where document_id = p_document_id
		and state = 'current';

	update public.corporate_documents
	set status = 'archived',
		current_version_id = null,
		updated_by = auth.uid(),
		updated_at = v_now
	where id = p_document_id
	returning *
	into v_document;

	return v_document;
end;
$$;

alter table public.document_categories enable row level security;
alter table public.corporate_documents enable row level security;
alter table public.corporate_document_versions enable row level security;

revoke all on table public.document_categories from anon, authenticated;
revoke all on table public.corporate_documents from anon, authenticated;
revoke all on table public.corporate_document_versions from anon, authenticated;

grant select (id, slug, title, description, sort_order, active, updated_at)
	on public.document_categories
	to anon, authenticated;

grant select (id, category_id, slug, title, summary, responsible_department, current_version_id, sort_order, published_at, updated_at)
	on public.corporate_documents
	to anon, authenticated;

grant select (id, document_id, version_label, effective_date, revision_date, public_filename, mime_type, file_size, checksum_sha256, published_at, created_at)
	on public.corporate_document_versions
	to anon, authenticated;

grant insert, update, delete on public.document_categories to authenticated;
grant insert, update, delete on public.corporate_documents to authenticated;
grant insert, update, delete on public.corporate_document_versions to authenticated;

revoke all on function public.publish_corporate_document_version(uuid, uuid) from public;
revoke all on function public.archive_corporate_document(uuid) from public;
grant execute on function public.publish_corporate_document_version(uuid, uuid) to authenticated;
grant execute on function public.archive_corporate_document(uuid) to authenticated;

drop policy if exists "Public can read active document categories" on public.document_categories;
create policy "Public can read active document categories"
	on public.document_categories
	for select
	to anon, authenticated
	using (active is true);

drop policy if exists "Active administrators can manage document categories" on public.document_categories;
create policy "Active administrators can manage document categories"
	on public.document_categories
	for all
	to authenticated
	using (public.is_admin())
	with check (public.is_admin());

drop policy if exists "Public can read published corporate documents" on public.corporate_documents;
create policy "Public can read published corporate documents"
	on public.corporate_documents
	for select
	to anon, authenticated
	using (
		status = 'published'
		and deleted_at is null
		and current_version_id is not null
		and exists (
			select 1
			from public.document_categories category
			where category.id = corporate_documents.category_id
				and category.active is true
		)
	);

drop policy if exists "Active administrators can manage corporate documents" on public.corporate_documents;
create policy "Active administrators can manage corporate documents"
	on public.corporate_documents
	for all
	to authenticated
	using (public.is_admin())
	with check (public.is_admin());

drop policy if exists "Public can read current corporate document versions" on public.corporate_document_versions;
create policy "Public can read current corporate document versions"
	on public.corporate_document_versions
	for select
	to anon, authenticated
	using (
		state = 'current'
		and exists (
			select 1
			from public.corporate_documents document
			join public.document_categories category on category.id = document.category_id
			where document.id = corporate_document_versions.document_id
				and document.current_version_id = corporate_document_versions.id
				and document.status = 'published'
				and document.deleted_at is null
				and category.active is true
		)
	);

drop policy if exists "Active administrators can manage corporate document versions" on public.corporate_document_versions;
create policy "Active administrators can manage corporate document versions"
	on public.corporate_document_versions
	for all
	to authenticated
	using (public.is_admin())
	with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'corporate-documents',
	'corporate-documents',
	false,
	52428800,
	array['application/pdf']
)
on conflict (id) do update
set public = false,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Active administrators can read corporate document objects" on storage.objects;
create policy "Active administrators can read corporate document objects"
	on storage.objects
	for select
	to authenticated
	using (
		bucket_id = 'corporate-documents'
		and public.is_admin()
	);

drop policy if exists "Active administrators can upload corporate document objects" on storage.objects;
create policy "Active administrators can upload corporate document objects"
	on storage.objects
	for insert
	to authenticated
	with check (
		bucket_id = 'corporate-documents'
		and public.is_admin()
	);

drop policy if exists "Active administrators can update draft corporate document objects" on storage.objects;
create policy "Active administrators can update draft corporate document objects"
	on storage.objects
	for update
	to authenticated
	using (
		bucket_id = 'corporate-documents'
		and public.is_admin()
		and not exists (
			select 1
			from public.corporate_document_versions version
			where version.storage_path = storage.objects.name
				and version.state <> 'draft'
		)
	)
	with check (
		bucket_id = 'corporate-documents'
		and public.is_admin()
		and not exists (
			select 1
			from public.corporate_document_versions version
			where version.storage_path = storage.objects.name
				and version.state <> 'draft'
		)
	);

drop policy if exists "Active administrators can delete draft corporate document objects" on storage.objects;
create policy "Active administrators can delete draft corporate document objects"
	on storage.objects
	for delete
	to authenticated
	using (
		bucket_id = 'corporate-documents'
		and public.is_admin()
		and not exists (
			select 1
			from public.corporate_document_versions version
			where version.storage_path = storage.objects.name
				and version.state <> 'draft'
		)
	);

commit;
