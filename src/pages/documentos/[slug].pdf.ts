import type { APIRoute } from 'astro';

import { getPublishedDocumentPdf } from '@lib/documents/pdf.server';

export const prerender = false;

const allowHeader = {
	Allow: 'GET, HEAD',
};

async function respondWithPdf(slug: string | undefined, includeBody: boolean) {
	const result = await getPublishedDocumentPdf(slug ?? '', includeBody);

	if (result.status === 'not-found') {
		return new Response('Not found', { status: 404 });
	}

	if (result.status === 'unavailable') {
		return new Response('Document delivery unavailable', {
			status: 503,
			headers: {
				'Cache-Control': 'no-store',
				'X-Content-Type-Options': 'nosniff',
			},
		});
	}

	if (result.status !== 'ok') {
		return new Response('Not found', { status: 404 });
	}

	return new Response(includeBody ? result.body : null, {
		headers: result.headers,
		status: 200,
	});
}

export const GET: APIRoute = ({ params }) => respondWithPdf(params.slug, true);

export const HEAD: APIRoute = ({ params }) => respondWithPdf(params.slug, false);

const methodNotAllowed: APIRoute = () =>
	new Response('Method not allowed', {
		headers: allowHeader,
		status: 405,
	});

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const ALL = methodNotAllowed;
