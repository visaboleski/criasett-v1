import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

export function hasSupabaseSecretKeyConfig() {
	return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.SUPABASE_SECRET_KEY);
}

export function createSupabaseSecretKeyClient() {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const secretKey = import.meta.env.SUPABASE_SECRET_KEY;

	if (!url || !secretKey) {
		throw new Error('Missing server-only Supabase secret-key configuration.');
	}

	return createClient<Database>(url, secretKey, {
		auth: {
			autoRefreshToken: false,
			detectSessionInUrl: false,
			persistSession: false,
		},
	});
}
