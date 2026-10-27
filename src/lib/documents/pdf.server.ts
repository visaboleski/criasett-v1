import { getPublicCorporateDocumentBySlug, isDocumentSlug } from './public';

type PdfResult =
	| {
			status: 'ok';
			body: Blob | null;
			headers: Headers;
		}
	| {
			status: 'not-found' | 'unavailable';
		};

export async function getPublishedDocumentPdf(
	slug: string,
	_includeBody: boolean,
): Promise<PdfResult> {
	if (!isDocumentSlug(slug)) {
		return { status: 'not-found' };
	}

	const publicDocument = await getPublicCorporateDocumentBySlug(slug);

	if (!publicDocument) {
		return { status: 'not-found' };
	}

	console.error(
		`[documents] Published PDF metadata exists for "${slug}", but no Cloudflare document-storage binding is configured.`,
	);

	return { status: 'unavailable' };
}
