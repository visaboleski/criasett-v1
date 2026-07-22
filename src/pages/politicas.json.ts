import type { APIRoute } from 'astro';

import { listPublicCorporateDocuments } from '@lib/documents/public';

export const prerender = false;

export const GET: APIRoute = async () => {
	const documents = await listPublicCorporateDocuments();
	const latestUpdatedAt = documents
		.map((document) => document.updatedAt)
		.sort()
		.at(-1);

	return Response.json(
		{
			updatedAt: latestUpdatedAt ?? new Date(0).toISOString(),
			documents,
		},
		{
			headers: {
				'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
				'X-Content-Type-Options': 'nosniff',
			},
		},
	);
};

export const ALL: APIRoute = () =>
	new Response('Method not allowed', {
		headers: {
			Allow: 'GET',
		},
		status: 405,
	});
