import { readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const outputDirectory = resolve('dist');
const metadataNames = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);

async function removeMetadata(directory) {
	let entries;

	try {
		entries = await readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error?.code === 'ENOENT') return;
		throw error;
	}

	await Promise.all(
		entries.map(async (entry) => {
			const entryPath = resolve(directory, entry.name);

			if (entry.isDirectory()) {
				await removeMetadata(entryPath);
				return;
			}

			if (metadataNames.has(entry.name)) {
				await rm(entryPath);
			}
		}),
	);
}

await removeMetadata(outputDirectory);
