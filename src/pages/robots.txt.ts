import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
	if (!site) {
		throw new Error('Astro site URL is required to generate robots.txt.');
	}

	const isStaging = import.meta.env.PUBLIC_DEPLOYMENT_ENVIRONMENT === 'staging';
	const sitemapUrl = new URL('sitemap-index.xml', site);
	const content = isStaging
		? 'User-agent: *\nDisallow: /\n'
		: `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;

	return new Response(content, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
		},
	});
};
