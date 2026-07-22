begin;

do $$
declare
	v_admin_id uuid := '3127b34b-0270-4ce0-a671-6e52296094dc';
	v_non_admin_id uuid := gen_random_uuid();
	v_suffix text := lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
	v_category_id uuid := gen_random_uuid();
	v_document_id uuid := gen_random_uuid();
	v_version_id uuid := gen_random_uuid();
	v_second_version_id uuid := gen_random_uuid();
	v_category_slug text := 'phase2-test-' || v_suffix;
	v_document_slug text := 'phase2-test-document-' || v_suffix;
	v_storage_path text := 'phase2-test/' || v_suffix || '/v1/phase2-test-document-v1.pdf';
	v_second_storage_path text := 'phase2-test/' || v_suffix || '/v2/phase2-test-document-v2.pdf';
	v_public_count integer;
	v_admin_count integer;
	v_non_admin_write_denied boolean := false;
	v_publish_denied boolean := false;
	v_duplicate_current_denied boolean := false;
	v_published_without_current_denied boolean := false;
begin
	select count(*)
	into v_admin_count
	from public.admin_profiles;

	if v_admin_count <> 1 then
		raise exception 'expected exactly one admin profile, found %', v_admin_count;
	end if;

	execute 'set local role authenticated';
	perform set_config('request.jwt.claim.sub', v_admin_id::text, true);

	if not public.is_admin() then
		raise exception 'expected Vivian admin profile to be active';
	end if;

	execute 'reset role';

	select count(*)
	into v_admin_count
	from public.admin_profiles
	where user_id = v_admin_id
		and active is true
		and display_name = 'Vivian Saboleski';

	if v_admin_count <> 1 then
		raise exception 'Vivian admin profile is missing or incorrect';
	end if;

	insert into public.document_categories (id, slug, title)
	values (v_category_id, v_category_slug, 'Phase 2 Test Category');

	insert into public.corporate_documents (
		id,
		category_id,
		slug,
		title,
		summary,
		responsible_department,
		status,
		created_by,
		updated_by
	)
	values (
		v_document_id,
		v_category_id,
		v_document_slug,
		'Phase 2 Test Document',
		'Rollback-only publication test.',
		'Qualidade',
		'draft',
		v_admin_id,
		v_admin_id
	);

	insert into public.corporate_document_versions (
		id,
		document_id,
		version_label,
		effective_date,
		revision_date,
		storage_path,
		original_filename,
		public_filename,
		mime_type,
		file_size,
		checksum_sha256,
		created_by
	)
	values (
		v_version_id,
		v_document_id,
		'v1',
		current_date,
		current_date,
		v_storage_path,
		'phase2-test-document-v1.pdf',
		'phase2-test-document-v1.pdf',
		'application/pdf',
		128,
		repeat('a', 64),
		v_admin_id
	);

	insert into storage.objects (bucket_id, name, owner_id, metadata)
	values (
		'corporate-documents',
		v_storage_path,
		v_admin_id::text,
		'{"mimetype":"application/pdf","size":128}'::jsonb
	);

	begin
		execute 'set local role authenticated';
		perform set_config('request.jwt.claim.sub', v_non_admin_id::text, true);

		insert into public.document_categories (slug, title)
		values ('phase2-non-admin-write-' || v_suffix, 'Denied Category');
	exception
		when insufficient_privilege or with_check_option_violation then
			v_non_admin_write_denied := true;
	end;

	execute 'reset role';

	if not v_non_admin_write_denied then
		raise exception 'non-admin write was not denied';
	end if;

	begin
		execute 'set local role authenticated';
		perform set_config('request.jwt.claim.sub', v_non_admin_id::text, true);
		perform public.publish_corporate_document_version(v_document_id, v_version_id);
	exception
		when raise_exception or insufficient_privilege then
			v_publish_denied := true;
	end;

	execute 'reset role';

	if not v_publish_denied then
		raise exception 'non-admin publication was not denied';
	end if;

	execute 'set local role authenticated';
	perform set_config('request.jwt.claim.sub', v_admin_id::text, true);
	perform public.publish_corporate_document_version(v_document_id, v_version_id);
	execute 'reset role';

	if not exists (
		select 1
		from public.corporate_documents document
		join public.corporate_document_versions version
			on version.id = document.current_version_id
		where document.id = v_document_id
			and document.status = 'published'
			and version.state = 'current'
			and version.published_at is not null
	) then
		raise exception 'publication transaction did not set a current published version';
	end if;

	insert into public.corporate_document_versions (
		id,
		document_id,
		version_label,
		effective_date,
		revision_date,
		storage_path,
		original_filename,
		public_filename,
		mime_type,
		file_size,
		checksum_sha256,
		created_by
	)
	values (
		v_second_version_id,
		v_document_id,
		'v2',
		current_date,
		current_date,
		v_second_storage_path,
		'phase2-test-document-v2.pdf',
		'phase2-test-document-v2.pdf',
		'application/pdf',
		128,
		repeat('b', 64),
		v_admin_id
	);

	begin
		update public.corporate_document_versions
		set state = 'current',
			published_at = now()
		where id = v_second_version_id;
	exception
		when unique_violation or raise_exception then
			v_duplicate_current_denied := true;
	end;

	if not v_duplicate_current_denied then
		raise exception 'second current version was not denied';
	end if;

	begin
		insert into public.corporate_documents (
			category_id,
			slug,
			title,
			status
		)
		values (
			v_category_id,
			'phase2-invalid-published-' || v_suffix,
			'Invalid Published Document',
			'published'
		);
	exception
		when check_violation then
			v_published_without_current_denied := true;
	end;

	if not v_published_without_current_denied then
		raise exception 'published document without current version was not denied';
	end if;

	insert into public.corporate_documents (category_id, slug, title)
	values (v_category_id, 'phase2-draft-hidden-' || v_suffix, 'Hidden Draft Document');

	execute 'set local role anon';
	select count(*)
	into v_public_count
	from public.corporate_documents
	where slug = 'phase2-draft-hidden-' || v_suffix;
	execute 'reset role';

	if v_public_count <> 0 then
		raise exception 'anonymous public read exposed a draft document';
	end if;

	if not exists (
		select 1
		from storage.buckets
		where id = 'corporate-documents'
			and public is false
			and file_size_limit = 52428800
			and allowed_mime_types = array['application/pdf']
	) then
		raise exception 'corporate-documents storage bucket is not private PDF-only storage';
	end if;
end;
$$;

rollback;

select 'corporate_document_foundation_ok' as result;
