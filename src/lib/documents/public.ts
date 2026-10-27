import { policyLibraryItems, type PolicyLibraryItem } from '@data/policy-library';

export type PublicCorporateDocument = {
	title: string;
	slug: string;
	category: {
		title: string;
		slug: string;
	};
	summary: string;
	responsibleDepartment: null;
	currentVersion: string;
	effectiveDate: string | null;
	revisionDate: string | null;
	canonicalHtmlUrl: string;
	stablePdfUrl: string;
	updatedAt: string;
};

export type PublicPolicyCatalogItem = Pick<
	PolicyLibraryItem,
	'slug' | 'title' | 'description'
> & {
	published: boolean;
	pdf: PolicyLibraryItem['publishedPdf'];
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isDocumentSlug(value: string | undefined): value is string {
	return Boolean(value && slugPattern.test(value));
}

export function isValidPublicDocumentUrl(value: string) {
	if (value.startsWith('/')) return true;

	try {
		return new URL(value).protocol === 'https:';
	} catch {
		return false;
	}
}

export function listPublicPolicyCatalog(): PublicPolicyCatalogItem[] {
	return policyLibraryItems.map((item) => ({
		slug: item.slug,
		title: item.title,
		description: item.description,
		published: Boolean(item.publishedPdf),
		pdf: item.publishedPdf,
	}));
}

export async function listPublicCorporateDocuments(): Promise<PublicCorporateDocument[]> {
	return policyLibraryItems.flatMap((item) => {
		const pdf = item.publishedPdf;

		if (!pdf || !isValidPublicDocumentUrl(pdf.publicUrl)) return [];

		return [
			{
				title: item.title,
				slug: item.slug,
				category: {
					title: 'Políticas',
					slug: 'politicas',
				},
				summary: item.description,
				responsibleDepartment: null,
				currentVersion: pdf.version,
				effectiveDate: pdf.effectiveDate ?? null,
				revisionDate: pdf.revisionDate ?? null,
				canonicalHtmlUrl: `/politicas/${item.slug}`,
				stablePdfUrl: pdf.publicUrl,
				updatedAt: pdf.updatedAt ?? pdf.publishedAt,
			},
		];
	});
}

export async function getPublicCorporateDocumentBySlug(slug: string) {
	if (!isDocumentSlug(slug)) return null;

	const documents = await listPublicCorporateDocuments();

	return documents.find((document) => document.slug === slug) ?? null;
}
