const FALLBACK_ADMIN_PATH = '/admin';

export function getSafeAdminRedirect(value: FormDataEntryValue | string | null) {
	if (typeof value !== 'string' || !value.startsWith('/admin') || value.startsWith('//')) {
		return FALLBACK_ADMIN_PATH;
	}

	return value;
}

export function getAdminLoginPath(redirectTo = FALLBACK_ADMIN_PATH, error?: string) {
	const params = new URLSearchParams({ redirectTo });

	if (error) {
		params.set('error', error);
	}

	return `/admin/login?${params.toString()}`;
}

export function isSameOriginRequest(request: Request) {
	const origin = request.headers.get('origin');

	if (!origin) return true;

	return origin === new URL(request.url).origin;
}

export function redirectWithHeaders(location: string, headers = new Headers(), status = 303) {
	const redirectHeaders = new Headers(headers);

	redirectHeaders.set('Location', location);

	return new Response(null, {
		status,
		headers: redirectHeaders,
	});
}
