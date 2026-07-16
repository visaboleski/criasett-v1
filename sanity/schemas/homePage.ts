import { defineField, defineType } from 'sanity';

export const homePage = defineType({
	name: 'homePage',
	title: 'Página inicial',
	type: 'document',
	fields: [
		defineField({ name: 'eyebrow', title: 'Chamada pequena', type: 'string' }),
		defineField({ name: 'headline', title: 'Título principal', type: 'string' }),
		defineField({ name: 'intro', title: 'Texto de apoio', type: 'text', rows: 3 }),
		defineField({ name: 'primaryCtaLabel', title: 'CTA principal', type: 'string' }),
		defineField({ name: 'primaryCtaHref', title: 'Link do CTA principal', type: 'string' }),
		defineField({ name: 'secondaryCtaLabel', title: 'CTA secundário', type: 'string' }),
		defineField({ name: 'secondaryCtaHref', title: 'Link do CTA secundário', type: 'string' }),
		defineField({
			name: 'credibility',
			title: 'Faixa de credibilidade',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'value', title: 'Valor', type: 'string' }),
						defineField({ name: 'label', title: 'Descrição', type: 'string' }),
					],
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: 'Página inicial' }),
	},
});

