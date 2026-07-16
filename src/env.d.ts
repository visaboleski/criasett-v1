/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
	readonly PUBLIC_SITE_URL?: string;
	readonly PUBLIC_SANITY_PROJECT_ID?: string;
	readonly PUBLIC_SANITY_DATASET?: string;
	readonly SANITY_API_READ_TOKEN?: string;
	readonly IMAGEKIT_URL_ENDPOINT?: string;
	readonly IMAGEKIT_PUBLIC_KEY?: string;
	readonly IMAGEKIT_PRIVATE_KEY?: string;
	readonly CONTACT_TO_EMAIL?: string;
	readonly CONTACT_FROM_EMAIL?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

