export type SupabasePublicConfig = {
	url: string;
	publishableKey: string;
};

export function getSupabasePublicConfig(): SupabasePublicConfig {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const publishableKey = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

	if (!url || !publishableKey) {
		throw new Error(
			'Missing PUBLIC_SUPABASE_URL or PUBLIC_SUPABASE_PUBLISHABLE_KEY environment variables.',
		);
	}

	return { url, publishableKey };
}

export function hasSupabasePublicConfig() {
	return Boolean(import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
