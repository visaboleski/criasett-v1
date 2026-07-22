import type { APIRoute } from 'astro';

import { getAdminSession } from '@lib/auth/admin';
import {
	getAdminLoginPath,
	getSafeAdminRedirect,
	isSameOriginRequest,
	redirectWithHeaders,
} from '@lib/auth/redirects';
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

	const redirectToLogin = (redirectTo: string, error: string) =>
		redirectWithHeaders(getAdminLoginPath(redirectTo, error), responseHeaders);

	if (!isSameOriginRequest(context.request)) {
		return redirectToLogin('/admin', 'origin');
	}

	const formData = await context.request.formData();
	const redirectTo = getSafeAdminRedirect(formData.get('redirectTo'));

	if (!hasSupabasePublicConfig()) {
		return redirectToLogin(redirectTo, 'config');
	}

	const email = String(formData.get('email') ?? '').trim().toLowerCase();
	const password = String(formData.get('password') ?? '');

	if (!email || !password) {
		return redirectToLogin(redirectTo, 'credentials');
	}

	const supabase = createSupabaseServerClient({
		cookies: context.cookies,
		request: context.request,
		responseHeaders,
	});
	const { error } = await supabase.auth.signInWithPassword({ email, password });

	if (error) {
		return redirectToLogin(redirectTo, 'credentials');
	}

	const adminSession = await getAdminSession(supabase);

	if (!adminSession) {
		await supabase.auth.signOut();
		return redirectToLogin(redirectTo, 'forbidden');
	}

	return redirectWithHeaders(redirectTo, responseHeaders);
};
