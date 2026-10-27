export type CertificateDocumentId = 'iso-9001' | 'fsc';

export type CertificateDocument = {
	id: CertificateDocumentId;
	pdfUrl: string | null;
};

const certificateDocumentsBaseUrl =
	'https://pub-3ede6d0f172c4a2da78d0a7bf7b37b60.r2.dev/documents/certificacoes';

export const certificateDocuments: Record<CertificateDocumentId, CertificateDocument> = {
	'iso-9001': {
		id: 'iso-9001',
		pdfUrl: `${certificateDocumentsBaseUrl}/iso9001.pdf`,
	},
	fsc: {
		id: 'fsc',
		pdfUrl: `${certificateDocumentsBaseUrl}/fsc.pdf`,
	},
};
