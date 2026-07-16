import { defineField, defineType } from 'sanity';

export const portfolioItem = defineType({
	name: 'portfolioItem',
	title: 'Item de portfólio',
	type: 'document',
	fields: [
		defineField({ name: 'title', title: 'Título', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: { source: 'title', maxLength: 96 },
			validation: (Rule) => Rule.required(),
		}),
		defineField({
			name: 'category',
			title: 'Categoria',
			type: 'string',
			options: {
				list: [
					{ title: 'Embalagem', value: 'embalagem' },
					{ title: 'PDV', value: 'pdv' },
					{ title: 'Promocional', value: 'promocional' },
				],
				layout: 'radio',
			},
		}),
		defineField({ name: 'summary', title: 'Resumo', type: 'text', rows: 3 }),
		defineField({ name: 'mainImage', title: 'Imagem principal', type: 'image', options: { hotspot: true } }),
		defineField({ name: 'client', title: 'Cliente', type: 'string' }),
		defineField({ name: 'materials', title: 'Materiais/acabamentos', type: 'array', of: [{ type: 'string' }] }),
		defineField({ name: 'featured', title: 'Destacar na home', type: 'boolean', initialValue: false }),
		defineField({ name: 'orderRank', title: 'Ordem manual', type: 'number' }),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'category',
			media: 'mainImage',
		},
	},
});

