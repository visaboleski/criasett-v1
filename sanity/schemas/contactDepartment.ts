import { defineField, defineType } from 'sanity';

export const contactDepartment = defineType({
	name: 'contactDepartment',
	title: 'Departamento de contato',
	type: 'document',
	fields: [
		defineField({ name: 'title', title: 'Departamento', type: 'string', validation: (Rule) => Rule.required() }),
		defineField({ name: 'description', title: 'Descrição', type: 'text', rows: 2 }),
		defineField({ name: 'email', title: 'E-mail', type: 'email' }),
		defineField({ name: 'phone', title: 'Telefone', type: 'string' }),
		defineField({ name: 'whatsapp', title: 'WhatsApp', type: 'string' }),
		defineField({ name: 'orderRank', title: 'Ordem manual', type: 'number' }),
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'email',
		},
	},
});

