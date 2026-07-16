import { defineField, defineType } from 'sanity';

export const policyDocument = defineType({
	name: 'policyDocument',
	title: 'Política / PDF',
	type: 'document',
	fields: [
		defineField({ name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({
			name: 'category',
			title: 'Categoria',
			type: 'string',
			options: {
				list: [
					{ title: 'Qualidade', value: 'qualidade' },
					{ title: 'Sustentabilidade', value: 'sustentabilidade' },
					{ title: 'Compliance', value: 'compliance' },
					{ title: 'Privacidade', value: 'privacidade' },
					{ title: 'Outras', value: 'outras' },
				],
			},
		}),
		defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 3 }),
		defineField({ name: 'file', title: 'Arquivo PDF', type: 'file', options: { accept: '.pdf' } }),
		defineField({ name: 'externalUrl', title: 'URL externa', type: 'url' }),
		defineField({ name: 'publishedAt', title: 'Data de publicação', type: 'date' }),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'category',
		},
	},
});

