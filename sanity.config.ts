import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { structure } from './sanity/desk/structure';
import { schemaTypes } from './sanity/schemas';

const env = import.meta.env;
const projectId = env.PUBLIC_SANITY_PROJECT_ID || '00000000';
const dataset = env.PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
	name: 'criasett',
	title: 'Criasett Admin',
	projectId,
	dataset,
	plugins: [structureTool({ structure }), visionTool()],
	schema: {
		types: schemaTypes,
	},
});
