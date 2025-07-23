export function hashString(s: string, range: number) {
	let hash = 5381;
	for (let i = 0; i < s.length; i++) {
		hash = (hash << 5) + hash + s.charCodeAt(i);
		hash = hash & hash;
	}
	hash = Math.abs(hash);
	return hash % range;
}
