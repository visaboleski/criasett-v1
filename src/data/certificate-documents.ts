import { getPublicMediaUrl } from '@data/public-media';

export type CertificateDocumentId = 'iso-9001' | 'fsc';

export type CertificateDocument = {
	id: CertificateDocumentId;
	pdfUrl: string | null;
};

export const certificateDocuments: Record<CertificateDocumentId, CertificateDocument> = {
	'iso-9001': {
		id: 'iso-9001',
		pdfUrl: getPublicMediaUrl('documents/certificacoes/iso9001.pdf'),
	},
	fsc: {
		id: 'fsc',
		pdfUrl: getPublicMediaUrl('documents/certificacoes/fsc.pdf'),
	},
};
