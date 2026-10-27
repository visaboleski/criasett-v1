export function isValidPublicDocumentUrl(value: string) {
	if (value.startsWith('/')) return true;

	try {
		return new URL(value).protocol === 'https:';
	} catch {
		return false;
	}
}
