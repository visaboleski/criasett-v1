import { defineField, defineType } from 'sanity';

export const post = defineType({
	name: 'post',
	title: 'Post do blog',
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
		defineField({ name: 'excerpt', title: 'Resumo', type: 'text', rows: 3 }),
		defineField({ name: 'publishedAt', title: 'Data de publicação', type: 'datetime' }),
		defineField({ name: 'mainImage', title: 'Imagem principal', type: 'image', options: { hotspot: true } }),
		defineField({ name: 'body', title: 'Conteúdo', type: 'blockContent' }),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'publishedAt',
			media: 'mainImage',
		},
	},
});

