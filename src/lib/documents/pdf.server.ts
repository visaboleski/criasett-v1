import { createSupabaseServiceRoleClient, hasSupabaseServiceRoleConfig } from '@lib/supabase/service-role.server';
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

function getPdfHeaders(input: {
	checksumSha256: string;
	fileSize: number;
	filename: string;
	lastModified: string;
}) {
	const headers = new Headers();
	headers.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
	headers.set('Content-Disposition', `inline; filename="${input.filename}"`);
	headers.set('Content-Length', String(input.fileSize));
	headers.set('Content-Type', 'application/pdf');
	headers.set('ETag', `"${input.checksumSha256}"`);
	headers.set('Last-Modified', new Date(input.lastModified).toUTCString());
	headers.set('X-Content-Type-Options', 'nosniff');

	return headers;
}

export async function getPublishedDocumentPdf(slug: string, includeBody: boolean): Promise<PdfResult> {
	if (!isDocumentSlug(slug)) {
		return { status: 'not-found' };
	}

	if (!hasSupabaseServiceRoleConfig()) {
		const publicDocument = await getPublicCorporateDocumentBySlug(slug);

		return publicDocument ? { status: 'unavailable' } : { status: 'not-found' };
	}

	const supabase = createSupabaseServiceRoleClient();
	const { data: document, error: documentError } = await supabase
		.from('corporate_documents')
		.select('id, current_version_id, published_at, updated_at')
		.eq('slug', slug)
		.eq('status', 'published')
		.is('deleted_at', null)
		.not('current_version_id', 'is', null)
		.single();

	if (documentError || !document?.current_version_id) {
		return { status: 'not-found' };
	}

	const { data: version, error: versionError } = await supabase
		.from('corporate_document_versions')
		.select('id, document_id, storage_path, public_filename, mime_type, file_size, checksum_sha256, published_at, created_at')
		.eq('id', document.current_version_id)
		.eq('document_id', document.id)
		.eq('state', 'current')
		.single();

	if (versionError || !version || version.mime_type !== 'application/pdf') {
		return { status: 'not-found' };
	}

	const headers = getPdfHeaders({
		checksumSha256: version.checksum_sha256,
		fileSize: version.file_size,
		filename: version.public_filename,
		lastModified: version.published_at ?? document.updated_at ?? document.published_at ?? version.created_at,
	});

	if (!includeBody) {
		return {
			status: 'ok',
			body: null,
			headers,
		};
	}

	const { data: file, error: fileError } = await supabase.storage
		.from('corporate-documents')
		.download(version.storage_path);

	if (fileError || !file) {
		return { status: 'not-found' };
	}

	return {
		status: 'ok',
		body: file,
		headers,
	};
}
