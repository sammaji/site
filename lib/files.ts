import fs from "fs";
import path from "path";

export function files(folder: string) {
	const fpath = path.join(process.cwd(), "md", folder);
	const files = fs.readdirSync(fpath);
	return files.filter(f => !f.startsWith("_")).map(f => f.replace(".md", ""));
}
