export type CertificateDocumentId = 'iso-9001' | 'fsc';

export type CertificateDocument = {
	id: CertificateDocumentId;
	pdfUrl: string | null;
};

export const certificateDocuments: Record<CertificateDocumentId, CertificateDocument> = {
	'iso-9001': {
		id: 'iso-9001',
		pdfUrl: null,
	},
	fsc: {
		id: 'fsc',
		pdfUrl: null,
	},
};
