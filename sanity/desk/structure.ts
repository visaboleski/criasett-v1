import type { StructureResolver } from 'sanity/structure';

const singleton = (S: Parameters<StructureResolver>[0], type: string, title: string) =>
	S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type));

export const structure: StructureResolver = (S) =>
	S.list()
		.title('Conteúdo')
		.items([
			singleton(S, 'siteSettings', 'Configurações do site'),
			singleton(S, 'homePage', 'Página inicial'),
			S.divider(),
			S.documentTypeListItem('portfolioItem').title('Portfólio'),
			S.documentTypeListItem('post').title('Blog'),
			S.documentTypeListItem('policyDocument').title('Políticas e PDFs'),
			S.divider(),
			S.documentTypeListItem('equipment').title('Estrutura e equipamentos'),
			S.documentTypeListItem('certification').title('Prêmios e certificações'),
			S.documentTypeListItem('contactDepartment').title('Departamentos de contato'),
		]);

