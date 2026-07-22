import { createClient } from '@supabase/supabase-js';

import { getSupabasePublicConfig, hasSupabasePublicConfig } from './config';
import type { Database } from './database.types';

export function createSupabasePublicServerClient() {
	const { url, publishableKey } = getSupabasePublicConfig();

	return createClient<Database>(url, publishableKey, {
		auth: {
			autoRefreshToken: false,
			detectSessionInUrl: false,
			persistSession: false,
		},
	});
}

export { hasSupabasePublicConfig };
