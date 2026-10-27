# LEGACY INFRASTRUCTURE INVENTORY

> Historical snapshot from preservation commit `4549c517010b5838b274f3a0dbd4780780707310`.
> The static-migration branch removes this infrastructure from the active repository runtime;
> the external Vercel and Supabase projects are not modified by that cleanup.

This inventory records the transitional infrastructure found during the Homepage/foundation redesign before static conversion.

## Supabase

- Direct packages: `@supabase/ssr`, `@supabase/supabase-js`, and the `supabase` development CLI.
- Installed runtime packages pulled by those dependencies: `@supabase/auth-js`, `@supabase/functions-js`, `@supabase/postgrest-js`, `@supabase/realtime-js`, `@supabase/storage-js`, and `@supabase/phoenix`; the CLI also installs platform-specific binaries.
- Environment variables: `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_SECRET_KEY`.
- Client modules: `src/lib/supabase/browser.ts`, `server.ts`, `public-server.ts`, `secret-key.server.ts`, and `config.ts`.
- Referenced tables: `admin_profiles`, `document_categories`, `corporate_documents`, and `corporate_document_versions`.
- Referenced storage bucket: `corporate-documents`.
- Authentication: password sign-in/sign-out and session validation for `/admin`; authorization reads `admin_profiles`.
- Dependent routes: `/admin`, `/admin/login`, `/admin/logout`, `/admin/api/login`, `/politicas/[slug]`, `/politicas.json`, and `/documentos/[slug].pdf`.
- Public rendering dependency: policy detail pages, the policies JSON endpoint, and the PDF route use Supabase when configured; their current helpers return empty/fallback states when public configuration is absent. The `/politicas` index currently uses local static content.
- Data to preserve before removal: admin profiles, document categories, document metadata, document-version metadata, and every PDF/object in the `corporate-documents` bucket.
- Database artifacts: four migrations, one SQL test, generated database types, and the local Supabase configuration remain in the repository.

## Vercel

- Package and runtime adapter: `@astrojs/vercel` configured in `astro.config.mjs`.
- Vercel preview URLs are also present in `supabase/config.toml` as allowed authentication redirect targets.
- `.vercel/` is ignored by Git.
- No new Vercel-specific API, storage, middleware, or runtime dependency was added by this redesign.

## Other transitional media infrastructure

- `@imagekit/astro` is conditionally enabled by `IMAGEKIT_URL_ENDPOINT`.
- Environment declarations also include `IMAGEKIT_PUBLIC_KEY` and `IMAGEKIT_PRIVATE_KEY`.
- No new ImageKit usage was added by this redesign.

## Migration boundary

The existing Vercel preview adapter and all Supabase functionality remain unchanged for development continuity. A later, explicitly scoped migration should move public files to Cloudflare R2, introduce D1 only if managed metadata is still required, replace admin authentication with a Cloudflare-compatible layer, and remove legacy dependencies only after export and validation of the data listed above.
