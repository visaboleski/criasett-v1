import type { APIRoute } from 'astro';

import { getAdminLoginPath, isSameOriginRequest, redirectWithHeaders } from '@lib/auth/redirects';
import { hasSupabasePublicConfig } from '@lib/supabase/config';
import { createSupabaseServerClient } from '@lib/supabase/server';

export const prerender = false;

export const GET: APIRoute = () =>
	redirectWithHeaders(
		getAdminLoginPath('/admin', 'method'),
		new Headers({ 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' }),
	);

export const POST: APIRoute = async (context) => {
	const responseHeaders = new Headers({
		'Cache-Control': 'private, no-store',
		'X-Robots-Tag': 'noindex',
	});

	if (!isSameOriginRequest(context.request)) {
		return redirectWithHeaders(getAdminLoginPath('/admin', 'origin'), responseHeaders);
	}

	if (hasSupabasePublicConfig()) {
		const supabase = createSupabaseServerClient({
			cookies: context.cookies,
			request: context.request,
			responseHeaders,
		});
		await supabase.auth.signOut();
	}

	return redirectWithHeaders('/admin/login', responseHeaders);
};
