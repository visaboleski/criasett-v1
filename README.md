# Criasett Site

Astro starter for the new Gráfica Criasett website.

## Stack

- Astro for the fast public website
- Fully prerendered public pages and local TypeScript content
- ImageKit-ready media pipeline for optimized portfolio/images
- Cloudflare Workers Static Assets configuration for a later deployment

## Working Model

This is a normal Astro website first. Pages, components, layout, CSS, routes,
and visual design live in `src/`.

Public content lives in:

```bash
src/data/site.ts
```

The project builds as a fully static site. It has no application server,
database, authentication, admin interface, or upload API.

## Local Development

```bash
pnpm dev
```

Open:

- Site: `http://localhost:4321`
The public site runs entirely from local source and content.

## Environment

Copy `.env.example` to `.env.local` when the real services are ready.

ImageKit can be added later:

```bash
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_account"
```

Do not add ImageKit private keys or access tokens to browser-exposed environment
variables.

## Static Build

```bash
pnpm build
```

The generated site is written to `dist/`. `wrangler.jsonc` is configured for a
future static-assets deployment, but deployment is intentionally a separate,
explicit step.

## Notes

The stakeholder review environment is:

`https://criasett-site.criasett-site.workers.dev/`

Production-domain work is intentionally paused until explicit stakeholder
approval. The authoritative Step 6A DNS audit, preservation requirements, and
cutover prerequisites are recorded in
[`docs/production-domain-freeze.md`](docs/production-domain-freeze.md).
