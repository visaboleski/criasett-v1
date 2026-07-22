import { createBrowserClient } from '@supabase/ssr';

import { getSupabasePublicConfig } from './config';
import type { Database } from './database.types';

export function createSupabaseBrowserClient() {
	const { url, publishableKey } = getSupabasePublicConfig();

	return createBrowserClient<Database>(url, publishableKey, {
		cookieOptions: {
			name: 'criasett-auth',
			path: '/',
			sameSite: 'lax',
			secure: import.meta.env.PROD,
		},
		cookies: {
			encode: 'tokens-only',
		},
		cookieEncoding: 'base64url',
	});
}
