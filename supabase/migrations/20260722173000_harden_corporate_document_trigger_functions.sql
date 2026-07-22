begin;

create or replace function public.prevent_corporate_document_version_overwrite()
returns trigger
language plpgsql
security definer
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

create or replace function public.prevent_approved_corporate_document_version_delete()
returns trigger
language plpgsql
security definer
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

create or replace function public.validate_corporate_document_integrity()
returns trigger
language plpgsql
security definer
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

create or replace function public.validate_corporate_document_version_integrity()
returns trigger
language plpgsql
security definer
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

commit;
