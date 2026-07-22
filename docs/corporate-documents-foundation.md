# Corporate Documents Foundation

Phase 2 adds a shared backend foundation for public corporate PDFs without adding the document-management admin UI yet.

## Scope

The foundation covers policies, certifications, sustainability records, compliance documents, quality documents, institutional documents, and optional award evidence through one shared model:

- `document_categories`
- `corporate_documents`
- `corporate_document_versions`

The current `/politicas` page remains on local content during the transition. Backend-backed document detail pages are available at `/politicas/[slug]` once published database records exist.

## Storage And Delivery

PDF objects live in the private Supabase Storage bucket `corporate-documents`. Public visitors do not receive direct anonymous storage access.

Published documents are delivered through the stable Astro route:

```text
/documentos/[slug].pdf
```

The route resolves the published document and current approved version, fetches the private object server-side, and returns PDF headers including `Content-Type`, `Content-Length`, `Content-Disposition`, `ETag`, and `Last-Modified`.

## Environment

The public Supabase URL and publishable key remain browser-safe:

```text
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

PDF delivery also requires a server-only service-role key:

```text
SUPABASE_SERVICE_ROLE_KEY=
```

Rules for this key:

- never prefix with `PUBLIC_`;
- never commit a real value;
- configure locally through ignored env files;
- configure in Vercel only where PDF delivery is required;
- use only in server-only files such as `src/lib/supabase/service-role.server.ts`;
- do not use it for normal browser-admin operations, which should use authenticated RLS.

## Public Index

`/politicas.json` returns a predictable public index for currently published documents. The name remains policy-oriented for launch compatibility, while the underlying model is intentionally broader.

The JSON excludes private storage paths, administrator IDs, superseded versions, internal status fields, and credentials.

## Type Updates

Supabase types are kept in `src/lib/supabase/database.types.ts`. After applying migrations, regenerate or refresh this file with a project-linked Supabase type generation workflow, then review the diff before committing.
