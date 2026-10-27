import type { APIRoute } from 'astro';

import {
	listPublicCorporateDocuments,
	listPublicPolicyCatalog,
} from '@lib/documents/public';

export const prerender = false;

export const GET: APIRoute = async () => {
	try {
		const policies = listPublicPolicyCatalog();
		const documents = await listPublicCorporateDocuments();
		const latestUpdatedAt = documents
			.map((document) => document.updatedAt)
			.sort()
			.at(-1);

		return Response.json(
			{
				updatedAt: latestUpdatedAt ?? null,
				policies,
				documents,
			},
			{
				headers: {
					'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=3600',
					'X-Content-Type-Options': 'nosniff',
				},
			},
		);
	} catch (error) {
		console.error(
			'[politicas.json] Unable to build the public policy catalog.',
			error,
		);

		return Response.json(
			{ error: 'Unable to load the public policy catalog.' },
			{
				headers: {
					'Cache-Control': 'no-store',
					'X-Content-Type-Options': 'nosniff',
				},
				status: 500,
			},
		);
	}
};

export const ALL: APIRoute = () =>
	new Response('Method not allowed', {
		headers: {
			Allow: 'GET',
		},
		status: 405,
	});
