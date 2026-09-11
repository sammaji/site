export type Note = {
	id: string;
	title: string;
	content: string;
	createdAt: number;
	updatedAt: number;
};

const NOTES_KEY = "notepad.notes.v1";
const ACTIVE_KEY = "notepad.active-id.v1";

function readKey(key: string): string | null {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeKey(key: string, value: string): boolean {
	try {
		window.localStorage.setItem(key, value);
		return true;
	} catch {
		return false;
	}
}

export function createId(): string {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
		return crypto.randomUUID();
	}
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createNote(): Note {
	const now = Date.now();
	return {
		id: createId(),
		title: "",
		content: "",
		createdAt: now,
		updatedAt: now,
	};
}

function isNote(value: unknown): value is Note {
	if (typeof value !== "object" || value === null) {
		return false;
	}

	const note = value as Partial<Note>;
	return (
		typeof note.id === "string" &&
		typeof note.title === "string" &&
		typeof note.content === "string" &&
		typeof note.createdAt === "number" &&
		typeof note.updatedAt === "number"
	);
}

export function loadNotes(): Note[] {
	const raw = readKey(NOTES_KEY);
	if (raw === null) {
		return [];
	}

	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) {
			return [];
		}
		return parsed.filter(isNote);
	} catch {
		return [];
	}
}

export function saveNotes(notes: Note[]): boolean {
	return writeKey(NOTES_KEY, JSON.stringify(notes));
}

export function loadActiveId(): string | null {
	return readKey(ACTIVE_KEY);
}

export function saveActiveId(id: string | null): boolean {
	return writeKey(ACTIVE_KEY, id ?? "");
}

export function hasStoredNotes(): boolean {
	return readKey(NOTES_KEY) !== null;
}

export function noteTitle(note: Note): string {
	const title = note.title.trim();
	if (title) {
		return title;
	}

	const firstLine = note.content.split("\n").find(line => line.trim());
	return firstLine ? firstLine.trim().slice(0, 60) : "Untitled";
}

export function notePreview(note: Note): string {
	const body =
		note.title.trim() ?
			note.content
		:	note.content.replace(/^\s*\S[^\n]*\n?/, "");

	const preview = body.replace(/\s+/g, " ").trim();
	return preview ? preview.slice(0, 80) : "No additional text";
}

export function countWords(content: string): number {
	const trimmed = content.trim();
	return trimmed ? trimmed.split(/\s+/).length : 0;
}
