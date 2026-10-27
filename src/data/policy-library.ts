export type PolicyLibraryItem = {
	slug: string;
	title: string;
	description: string;
	publishedPdf: PublishedPolicyPdf | null;
};

export type PublishedPolicyPdf = {
	publicUrl: string;
	version: string;
	publishedAt: string;
	updatedAt?: string;
	effectiveDate?: string;
	revisionDate?: string;
};

export const policyLibraryItems: readonly PolicyLibraryItem[] = [
	{
		slug: 'codigo-de-conduta-e-etica',
		title: 'Código de Conduta e Ética',
		description:
			'Princípios que orientam nossas relações profissionais e empresariais, promovendo integridade, respeito e transparência.',
		publishedPdf: null,
	},
	{
		slug: 'politica-de-anticorrupcao-e-canal-de-denuncias',
		title: 'Política de Anticorrupção e Canal de Denúncias',
		description:
			'Diretrizes de prevenção à corrupção, combate a irregularidades e comunicação de condutas incompatíveis com nossos princípios.',
		publishedPdf: null,
	},
	{
		slug: 'politica-de-qualidade',
		title: 'Política de Qualidade',
		description:
			'Diretrizes que orientam o controle dos processos, a melhoria contínua e o compromisso com a qualidade dos produtos.',
		publishedPdf: null,
	},
	{
		slug: 'politica-da-seguranca-da-informacao',
		title: 'Política da Segurança da Informação',
		description:
			'Princípios para proteção das informações, confidencialidade e utilização responsável dos recursos e dados corporativos.',
		publishedPdf: null,
	},
	{
		slug: 'politica-de-seguranca-e-saude-no-trabalho',
		title: 'Política de Segurança e Saúde no Trabalho',
		description:
			'Compromissos com a prevenção de acidentes, proteção da saúde e manutenção de condições seguras de trabalho.',
		publishedPdf: null,
	},
	{
		slug: 'politica-de-meio-ambiente-e-uso-da-terra',
		title: 'Política de Meio Ambiente e Uso da Terra',
		description:
			'Diretrizes para uma atuação ambientalmente responsável, uso consciente dos recursos naturais e preservação ambiental.',
		publishedPdf: null,
	},
];
