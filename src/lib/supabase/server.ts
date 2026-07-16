import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { APIContext } from 'astro';

import { getSupabasePublicConfig } from './config';
import type { Database } from './database.types';

type ServerContext = Pick<APIContext, 'cookies' | 'request'> & {
	responseHeaders?: Headers;
};

function parseCookieHeader(header: string | null) {
	if (!header) return [];

	return header
		.split(';')
		.map((part) => {
			const [rawName, ...rawValue] = part.trim().split('=');
			const name = rawName?.trim();
			const value = rawValue.join('=');

			if (!name) return null;

			let decodedValue = value;

			try {
				decodedValue = decodeURIComponent(value);
			} catch {
				decodedValue = value;
			}

			return {
				name,
				value: decodedValue,
			};
		})
		.filter((cookie): cookie is { name: string; value: string } => Boolean(cookie));
}

function toAstroCookieOptions(options: CookieOptions) {
	return {
		domain: options.domain,
		path: options.path ?? '/',
		expires: options.expires,
		maxAge: options.maxAge,
		httpOnly: options.httpOnly,
		sameSite: options.sameSite,
		secure: options.secure,
		partitioned: options.partitioned,
	};
}

export function createSupabaseServerClient(context: ServerContext) {
	const { url, publishableKey } = getSupabasePublicConfig();

	return createServerClient<Database>(url, publishableKey, {
		cookieOptions: {
			name: 'criasett-auth',
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD,
		},
		cookieEncoding: 'base64url',
		cookies: {
			encode: 'tokens-only',
			getAll() {
				return parseCookieHeader(context.request.headers.get('cookie'));
			},
			setAll(cookiesToSet, headers) {
				for (const { name, value, options } of cookiesToSet) {
					context.cookies.set(name, value, toAstroCookieOptions(options));
				}

				for (const [name, value] of Object.entries(headers)) {
					context.responseHeaders?.set(name, value);
				}
			},
		},
	});
}
