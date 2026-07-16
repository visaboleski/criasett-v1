import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
	name: 'siteSettings',
	title: 'Configurações do site',
	type: 'document',
	fields: [
		defineField({ name: 'title', title: 'Nome do site', type: 'string' }),
		defineField({ name: 'description', title: 'Descrição SEO padrão', type: 'text', rows: 3 }),
		defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string' }),
		defineField({ name: 'email', title: 'E-mail principal', type: 'email' }),
		defineField({ name: 'phone', title: 'Telefone', type: 'string' }),
		defineField({ name: 'address', title: 'Endereço', type: 'text', rows: 3 }),
		defineField({
			name: 'socialLinks',
			title: 'Redes sociais',
			type: 'array',
			of: [
				{
					type: 'object',
					fields: [
						defineField({ name: 'label', title: 'Nome', type: 'string' }),
						defineField({ name: 'url', title: 'URL', type: 'url' }),
					],
				},
			],
		}),
	],
	preview: {
		prepare: () => ({ title: 'Configurações do site' }),
	},
});

