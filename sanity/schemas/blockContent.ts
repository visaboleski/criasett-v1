import { defineArrayMember, defineField, defineType } from 'sanity';

export const blockContent = defineType({
	name: 'blockContent',
	title: 'Texto rico',
	type: 'array',
	of: [
		defineArrayMember({
			type: 'block',
			styles: [
				{ title: 'Normal', value: 'normal' },
				{ title: 'Título 2', value: 'h2' },
				{ title: 'Título 3', value: 'h3' },
				{ title: 'Citação', value: 'blockquote' },
			],
			lists: [
				{ title: 'Marcadores', value: 'bullet' },
				{ title: 'Numerada', value: 'number' },
			],
			marks: {
				decorators: [
					{ title: 'Negrito', value: 'strong' },
					{ title: 'Itálico', value: 'em' },
				],
				annotations: [
					defineField({
						name: 'link',
						title: 'Link',
						type: 'object',
						fields: [
							defineField({
								name: 'href',
								title: 'URL',
								type: 'url',
								validation: (Rule) => Rule.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
							}),
						],
					}),
				],
			},
		}),
		defineArrayMember({
			type: 'image',
			options: { hotspot: true },
			fields: [
				defineField({
					name: 'alt',
					title: 'Texto alternativo',
					type: 'string',
				}),
			],
		}),
	],
});

