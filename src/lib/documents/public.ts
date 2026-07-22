import {
	createSupabasePublicServerClient,
	hasSupabasePublicConfig,
} from '@lib/supabase/public-server';
import type { Database } from '@lib/supabase/database.types';

type DocumentCategoryRow = Database['public']['Tables']['document_categories']['Row'];
type CorporateDocumentRow = Database['public']['Tables']['corporate_documents']['Row'];
type CorporateDocumentVersionRow =
	Database['public']['Tables']['corporate_document_versions']['Row'];

export type PublicCorporateDocument = {
	title: string;
	slug: string;
	category: {
		title: string;
		slug: string;
	};
	summary: string | null;
	responsibleDepartment: string | null;
	currentVersion: string;
	effectiveDate: string | null;
	revisionDate: string | null;
	canonicalHtmlUrl: string;
	stablePdfUrl: string;
	updatedAt: string;
};

type PublicDocumentRows = {
	categories: Pick<DocumentCategoryRow, 'id' | 'slug' | 'title'>[];
	documents: Pick<
		CorporateDocumentRow,
		| 'id'
		| 'category_id'
		| 'slug'
		| 'title'
		| 'summary'
		| 'responsible_department'
		| 'current_version_id'
		| 'published_at'
		| 'updated_at'
		| 'sort_order'
	>[];
	versions: Pick<
		CorporateDocumentVersionRow,
		| 'id'
		| 'document_id'
		| 'version_label'
		| 'effective_date'
		| 'revision_date'
		| 'published_at'
		| 'created_at'
	>[];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isDocumentSlug(value: string | undefined): value is string {
	return Boolean(value && slugPattern.test(value));
}

function toPublicDocument(
	document: PublicDocumentRows['documents'][number],
	category: PublicDocumentRows['categories'][number],
	version: PublicDocumentRows['versions'][number],
): PublicCorporateDocument {
	return {
		title: document.title,
		slug: document.slug,
		category: {
			title: category.title,
			slug: category.slug,
		},
		summary: document.summary,
		responsibleDepartment: document.responsible_department,
		currentVersion: version.version_label,
		effectiveDate: version.effective_date,
		revisionDate: version.revision_date,
		canonicalHtmlUrl: `/politicas/${document.slug}`,
		stablePdfUrl: `/documentos/${document.slug}.pdf`,
		updatedAt: document.updated_at ?? version.published_at ?? document.published_at ?? version.created_at,
	};
}

async function fetchPublicDocumentRows(): Promise<PublicDocumentRows> {
	if (!hasSupabasePublicConfig()) {
		return {
			categories: [],
			documents: [],
			versions: [],
		};
	}

	const supabase = createSupabasePublicServerClient();
	const { data: documents, error: documentsError } = await supabase
		.from('corporate_documents')
		.select(
			'id, category_id, slug, title, summary, responsible_department, current_version_id, published_at, updated_at, sort_order',
		)
		.order('sort_order', { ascending: true })
		.order('title', { ascending: true });

	if (documentsError) {
		throw new Error('Unable to load public corporate documents.');
	}

	const currentDocuments = documents.filter((document) => document.current_version_id);

	if (currentDocuments.length === 0) {
		return {
			categories: [],
			documents: [],
			versions: [],
		};
	}

	const categoryIds = [...new Set(currentDocuments.map((document) => document.category_id))];
	const versionIds = currentDocuments.map((document) => document.current_version_id as string);

	const [{ data: categories, error: categoriesError }, { data: versions, error: versionsError }] =
		await Promise.all([
			supabase.from('document_categories').select('id, slug, title').in('id', categoryIds),
			supabase
				.from('corporate_document_versions')
				.select(
					'id, document_id, version_label, effective_date, revision_date, published_at, created_at',
				)
				.in('id', versionIds),
		]);

	if (categoriesError || versionsError) {
		throw new Error('Unable to load public corporate document metadata.');
	}

	return {
		categories,
		documents: currentDocuments,
		versions,
	};
}

export async function listPublicCorporateDocuments(): Promise<PublicCorporateDocument[]> {
	const { categories, documents, versions } = await fetchPublicDocumentRows();
	const categoriesById = new Map(categories.map((category) => [category.id, category]));
	const versionsById = new Map(versions.map((version) => [version.id, version]));

	return documents.flatMap((document) => {
		const category = categoriesById.get(document.category_id);
		const version = document.current_version_id
			? versionsById.get(document.current_version_id)
			: undefined;

		if (!category || !version) return [];

		return [toPublicDocument(document, category, version)];
	});
}

export async function getPublicCorporateDocumentBySlug(slug: string) {
	if (!isDocumentSlug(slug)) return null;

	const documents = await listPublicCorporateDocuments();

	return documents.find((document) => document.slug === slug) ?? null;
}
