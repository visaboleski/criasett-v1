import { defineField, defineType } from 'sanity';

export const equipment = defineType({
	name: 'equipment',
	title: 'Estrutura / equipamento',
	type: 'document',
	fields: [
		defineField({ name: 'title', title: 'Nome', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({
			name: 'area',
			title: 'Área',
			type: 'string',
			options: {
				list: [
					{ title: 'Pré-impressão', value: 'pre-impressao' },
					{ title: 'Impressão', value: 'impressao' },
					{ title: 'Acabamento', value: 'acabamento' },
					{ title: 'Qualidade', value: 'qualidade' },
					{ title: 'Logística', value: 'logistica' },
				],
			},
		}),
		defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 4 }),
		defineField({ name: 'highlights', title: 'Diferenciais', type: 'array', of: [{ type: 'string' }] }),
		defineField({ name: 'image', title: 'Imagem', type: 'image', options: { hotspot: true } }),
	],
});

