begin;

create table if not exists public.admin_profiles (
	user_id uuid primary key references auth.users(id) on delete cascade,
	active boolean not null default true,
	display_name text null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

comment on table public.admin_profiles is
	'Minimal allowlist for Criasett administrator access. Provision rows manually from a trusted database context.';

comment on column public.admin_profiles.user_id is
	'References the manually provisioned Supabase Auth user allowed to access /admin.';

alter table public.admin_profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = pg_catalog
as $$
	select exists (
		select 1
		from public.admin_profiles
		where user_id = auth.uid()
			and active is true
	);
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

revoke all on table public.admin_profiles from anon, authenticated;
grant select (user_id, active, display_name, created_at, updated_at)
	on public.admin_profiles
	to authenticated;

drop policy if exists "Active administrators can read their own profile"
	on public.admin_profiles;

create policy "Active administrators can read their own profile"
	on public.admin_profiles
	for select
	to authenticated
	using (
		auth.uid() is not null
		and user_id = auth.uid()
		and active is true
		and public.is_admin()
	);

commit;
