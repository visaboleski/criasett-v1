# Criasett Site

Astro starter for the new Gráfica Criasett website.

## Stack

- Astro for the fast public website
- Local TypeScript content while the website is being designed
- React-ready foundation for a narrow custom admin
- Supabase Auth foundation for one manually provisioned administrator
- ImageKit-ready media pipeline for optimized portfolio/images
- Vercel-ready hybrid build with static public pages and server-rendered admin routes

## Working Model

This is a normal Astro website first. Pages, components, layout, CSS, routes,
and visual design live in `src/`.

For now, public content lives in:

```bash
src/data/site.ts
```

The legacy CMS runtime has been removed. The future `/admin` route is reserved
for a narrow custom Criasett admin. Phase 1 adds only login, logout, protected
admin access, and the minimal `admin_profiles` authorization allowlist.

## Local Development

```bash
pnpm dev
```

Open:

- Site: `http://localhost:4321`
The public site runs from local content while the transition baseline is being
prepared.

## Environment

Copy `.env.example` to `.env.local` when the real services are ready.

ImageKit can be added later:

```bash
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_account"
```

Supabase admin authentication requires:

```bash
PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-publishable-or-anon-key"
```

Do not add service-role keys, database passwords, ImageKit private keys, or
access tokens to browser-exposed environment variables.

## Admin Foundation

- `/admin/login` renders the email/password login screen.
- `/admin` is server-rendered and requires an active `admin_profiles` row.
- `/admin/logout` signs out via POST.
- The migration lives in `supabase/migrations/20260716173500_admin_auth_foundation.sql`.
- Security notes and manual dashboard steps live in `docs/security-admin-auth.md`.

## Notes

The hero image in `public/images/industrial-print-hero.png` is a temporary generated placeholder. Replace it with real Criasett production photography as soon as available.
