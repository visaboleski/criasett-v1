import { defineField, defineType } from 'sanity';

export const certification = defineType({
	name: 'certification',
	title: 'Prêmio / certificação',
	type: 'document',
	fields: [
		defineField({ name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({ name: 'issuer', title: 'Emissor', type: 'string' }),
		defineField({ name: 'year', title: 'Ano', type: 'number' }),
		defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 3 }),
		defineField({ name: 'file', title: 'Arquivo comprobatório', type: 'file' }),
	],
});

