# Criasett Site

Astro starter for the new Gráfica Criasett website.

## Stack

- Astro for the fast public website
- Local TypeScript content while the website is being designed
- React-ready foundation for a future narrow custom admin
- ImageKit-ready media pipeline for optimized portfolio/images
- Vercel-ready static build

## Working Model

This is a normal Astro website first. Pages, components, layout, CSS, routes,
and visual design live in `src/`.

For now, public content lives in:

```bash
src/data/site.ts
```

The legacy CMS runtime has been removed. The future `/admin` route is reserved
for a narrow custom Criasett admin, but that admin is not implemented yet.

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

## Notes

The hero image in `public/images/industrial-print-hero.png` is a temporary generated placeholder. Replace it with real Criasett production photography as soon as available.
