/// <reference types="astro/client" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL?: string;
	readonly PUBLIC_SUPABASE_URL?: string;
	readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
	readonly SUPABASE_SECRET_KEY?: string;
	readonly IMAGEKIT_URL_ENDPOINT?: string;
	readonly IMAGEKIT_PUBLIC_KEY?: string;
	readonly IMAGEKIT_PRIVATE_KEY?: string;
	readonly CONTACT_TO_EMAIL?: string;
	readonly CONTACT_FROM_EMAIL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
