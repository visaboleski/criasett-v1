const defaultPublicMediaBaseUrl =
	'https://pub-3ede6d0f172c4a2da78d0a7bf7b37b60.r2.dev';

export const publicMediaBaseUrl = (
	import.meta.env.PUBLIC_MEDIA_BASE_URL?.trim() || defaultPublicMediaBaseUrl
).replace(/\/+$/, '');

export function getPublicMediaUrl(path: string) {
	return `${publicMediaBaseUrl}/${path.replace(/^\/+/, '')}`;
}

export const institutionalVideo = {
	src: getPublicMediaUrl('media/institucional/criasett-institucional.mp4'),
	poster: '/images/BACKGROUND4.png',
} as const;
