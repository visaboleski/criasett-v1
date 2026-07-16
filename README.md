# Criasett Site

Astro + Sanity starter for the new Gráfica Criasett website.

## Stack

- Astro for the fast public website
- Local TypeScript content while the website is being designed
- Sanity Studio embedded at `/admin` for content editing later
- ImageKit-ready media pipeline for optimized portfolio/images
- Vercel-ready static build

## Working Model

This is a normal Astro website first. Pages, components, layout, CSS, routes,
and visual design live in `src/`.

For now, public content lives in:

```bash
src/data/site.ts
```

Sanity is installed and available at `/admin`, but it does not need to drive the
day-to-day build until the site structure is approved. Once the site feels
right, we can selectively move portfolio items, blog posts, policies, and
contact departments from local content into Sanity.

## Local Development

```bash
pnpm dev
```

Open:

- Site: `http://localhost:4321`
- Admin: `http://localhost:4321/admin`

The site runs with fallback content until Sanity credentials are added.

## Environment

Copy `.env.example` to `.env.local` when the real services are ready.

Minimum values needed for Sanity:

```bash
PUBLIC_SANITY_PROJECT_ID="your_project_id"
PUBLIC_SANITY_DATASET="production"
```

ImageKit can be added later:

```bash
IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_account"
```

## Notes

The hero image in `public/images/industrial-print-hero.png` is a temporary generated placeholder. Replace it with real Criasett production photography as soon as available.
