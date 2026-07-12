export function ogImageUrl({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	const params = new URLSearchParams({ title });
	if (description) params.set("description", description);
	return `/og?${params.toString()}`;
}
