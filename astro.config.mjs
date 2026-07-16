import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import imagekit from '@imagekit/astro/integration';
import sanity from '@sanity/astro';
import { defineConfig } from 'astro/config';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function loadLocalEnv() {
	const parsed = {};

	for (const file of ['.env', '.env.local']) {
		const path = join(process.cwd(), file);
		if (!existsSync(path)) continue;

		for (const line of readFileSync(path, 'utf8').split('\n')) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) continue;

			const separator = trimmed.indexOf('=');
			if (separator === -1) continue;

			const key = trimmed.slice(0, separator).trim();
			let value = trimmed.slice(separator + 1).trim();

			if (
				(value.startsWith('"') && value.endsWith('"')) ||
				(value.startsWith("'") && value.endsWith("'"))
			) {
				value = value.slice(1, -1);
			}

			parsed[key] = value;
		}
	}

	return { ...parsed, ...process.env };
}

const env = loadLocalEnv();
const site = env.PUBLIC_SITE_URL || 'https://www.graficacriasett.com.br';
const sanityProjectId = env.PUBLIC_SANITY_PROJECT_ID || '00000000';
const sanityDataset = env.PUBLIC_SANITY_DATASET || 'production';
const imageKitEndpoint = env.IMAGEKIT_URL_ENDPOINT;

const integrations = [
	sanity({
		projectId: sanityProjectId,
		dataset: sanityDataset,
		useCdn: false,
		studioBasePath: '/admin',
	}),
	react(),
	sitemap(),
];

if (imageKitEndpoint) {
	integrations.push(
		imagekit({
			urlEndpoint: imageKitEndpoint,
		}),
	);
}

export default defineConfig({
	site,
	integrations,
});
