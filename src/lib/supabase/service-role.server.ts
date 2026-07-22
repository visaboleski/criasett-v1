import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

export function hasSupabaseServiceRoleConfig() {
	return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createSupabaseServiceRoleClient() {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url || !serviceRoleKey) {
		throw new Error('Missing server-only Supabase service-role configuration.');
	}

	return createClient<Database>(url, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			detectSessionInUrl: false,
			persistSession: false,
		},
	});
}
