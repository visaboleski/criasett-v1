import { sanityClient } from 'sanity:client';
import {
	fallbackDepartments,
	fallbackHome,
	fallbackPolicies,
	fallbackPortfolioItems,
	fallbackPosts,
} from '@data/fallback';

export type PortfolioItem = {
	title: string;
	slug: string;
	category?: string;
	summary?: string;
	imageUrl?: string;
	materials?: string[];
};

export type BlogPost = {
	title: string;
	slug: string;
	excerpt?: string;
	publishedAt?: string;
	imageUrl?: string;
};

export type PolicyDocument = {
	title: string;
	category?: string;
	description?: string;
	fileUrl?: string;
	externalUrl?: string;
	publishedAt?: string;
};

export type ContactDepartment = {
	title: string;
	description?: string;
	email?: string;
	phone?: string;
	whatsapp?: string;
};

export const sanityConfigured = Boolean(
	import.meta.env.PUBLIC_SANITY_PROJECT_ID && import.meta.env.PUBLIC_SANITY_DATASET,
);

async function safeFetch<T>(query: string, fallback: T, params: Record<string, unknown> = {}) {
	if (!sanityConfigured) {
		return fallback;
	}

	try {
		const result = await sanityClient.fetch<T | null>(query, params);

		if (result == null) {
			return fallback;
		}

		if (Array.isArray(result) && Array.isArray(fallback) && result.length === 0 && fallback.length > 0) {
			return fallback;
		}

		return result;
	} catch (error) {
		const message = error instanceof Error ? error.message : String(error);
		console.warn(`Sanity fetch failed; using fallback content. ${message}`);
		return fallback;
	}
}

export async function getHomeContent() {
	const home = await safeFetch<Partial<typeof fallbackHome>>(
		`*[_type == "homePage"][0]{
			eyebrow,
			headline,
			intro,
			primaryCtaLabel,
			primaryCtaHref,
			secondaryCtaLabel,
			secondaryCtaHref,
			credibility
		}`,
		fallbackHome,
	);

	return {
		...fallbackHome,
		...home,
		credibility: home.credibility?.length ? home.credibility : fallbackHome.credibility,
	};
}

export function getPortfolioItems(limit?: number) {
	const range = limit ? `[0...${limit}]` : '';
	return safeFetch<PortfolioItem[]>(
		`*[_type == "portfolioItem"] | order(coalesce(orderRank, 9999) asc, title asc) ${range}{
			title,
			"slug": slug.current,
			category,
			summary,
			materials,
			"imageUrl": mainImage.asset->url
		}`,
		limit ? fallbackPortfolioItems.slice(0, limit) : fallbackPortfolioItems,
	);
}

export function getBlogPosts(limit?: number) {
	const range = limit ? `[0...${limit}]` : '';
	return safeFetch<BlogPost[]>(
		`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) ${range}{
			title,
			"slug": slug.current,
			excerpt,
			publishedAt,
			"imageUrl": mainImage.asset->url
		}`,
		limit ? fallbackPosts.slice(0, limit) : fallbackPosts,
	);
}

export function getPolicies() {
	return safeFetch<PolicyDocument[]>(
		`*[_type == "policyDocument"] | order(category asc, title asc){
			title,
			category,
			description,
			publishedAt,
			externalUrl,
			"fileUrl": file.asset->url
		}`,
		fallbackPolicies,
	);
}

export function getContactDepartments() {
	return safeFetch<ContactDepartment[]>(
		`*[_type == "contactDepartment"] | order(coalesce(orderRank, 9999) asc, title asc){
			title,
			description,
			email,
			phone,
			whatsapp
		}`,
		fallbackDepartments,
	);
}
