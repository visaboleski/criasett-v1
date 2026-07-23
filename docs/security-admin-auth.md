# Criasett Admin Authentication Foundation

This phase adds only the authenticated admin foundation. It does not add content
tables, document storage, portfolio management, ImageKit uploads, or page
editing.

## Environment Contract

Required public runtime variables:

```bash
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

These values are safe for browser use. Do not commit or expose Supabase secret
keys, database passwords, ImageKit private keys, access tokens, or Supabase
personal tokens.

## Supabase Dashboard Setup

1. Create one administrator in Supabase Auth with email and password.
2. Run the migration in `supabase/migrations/20260716173500_admin_auth_foundation.sql`.
3. Provision the administrator profile from the SQL editor using the Auth user id:

```sql
insert into public.admin_profiles (user_id, display_name)
values ('00000000-0000-0000-0000-000000000000', 'Criasett Admin');
```

Provisioning is intentionally manual and trusted. There is no signup route,
registration UI, public role management, or browser-writable admin profile
policy.

## Authorization Model

- `/admin/login` accepts email and password only.
- `/admin` checks the Supabase Auth session server-side.
- A user must have an active `admin_profiles` row to enter `/admin`.
- Anonymous visitors cannot read `admin_profiles`.
- Authenticated users cannot insert, update, or activate admin profiles from
  browser clients.
- The `public.is_admin()` helper has no arguments and checks only `auth.uid()`.

## Security Notes

- Admin routes set `noindex,nofollow`.
- Auth routes set `Cache-Control: private, no-store`.
- Same-origin POST checks are used for login and logout.
- Admin authentication uses only the public Supabase client and RLS. Phase 2
  adds a separate server-only `SUPABASE_SECRET_KEY` only for private PDF
  delivery.
- Public site content remains local in `src/data/site.ts`.
