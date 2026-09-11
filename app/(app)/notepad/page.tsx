"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDistanceToNowStrict } from "date-fns";
import { ChevronLeft, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
	countWords,
	createNote,
	hasStoredNotes,
	loadActiveId,
	loadNotes,
	notePreview,
	noteTitle,
	saveActiveId,
	saveNotes,
	type Note,
} from "./storage";

type SaveState = "idle" | "saving" | "saved" | "error";

const SAVE_DEBOUNCE_MS = 400;

/**
 * Centres a 48rem text column while leaving the element itself full-width, so
 * the empty gutters beside the text still belong to the textarea's hit area.
 */
const COLUMN_PADDING = "px-[max(1rem,calc((100%-48rem)/2))]";

export default function NotepadPage() {
	const [notes, setNotes] = useState<Note[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [saveState, setSaveState] = useState<SaveState>("idle");
	const [confirmingDelete, setConfirmingDelete] = useState(false);
	// On small screens the sidebar and the editor share the same space.
	const [mobilePane, setMobilePane] = useState<"list" | "editor">("list");
	const [pendingFocusId, setPendingFocusId] = useState<string | null>(null);

	const loadedRef = useRef(false);
	const notesRef = useRef<Note[]>([]);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	notesRef.current = notes;

	const flush = useCallback(() => {
		if (!loadedRef.current) {
			return;
		}
		setSaveState(saveNotes(notesRef.current) ? "saved" : "error");
	}, []);

	// Hydrate from localStorage after mount so server and client markup match.
	useEffect(() => {
		const stored = loadNotes();
		const firstVisit = !hasStoredNotes();
		const initial = firstVisit && !stored.length ? [createNote()] : stored;
		const storedActiveId = loadActiveId();
		const active =
			initial.find(note => note.id === storedActiveId) ?? initial[0];

		setNotes(initial);
		setActiveId(active?.id ?? null);
		loadedRef.current = true;

		if (firstVisit && initial.length) {
			setSaveState(saveNotes(initial) ? "saved" : "error");
		}
	}, []);

	// Debounced persistence: typing should not hit localStorage every keystroke.
	// This effect deliberately sets no state — an effect that re-rendered on
	// every keystroke would stack a nested update per character.
	useEffect(() => {
		if (!loadedRef.current) {
			return;
		}

		const timeout = window.setTimeout(flush, SAVE_DEBOUNCE_MS);
		return () => window.clearTimeout(timeout);
	}, [notes, flush]);

	useEffect(() => {
		if (!loadedRef.current) {
			return;
		}
		saveActiveId(activeId);
	}, [activeId]);

	// Safari can kill a backgrounded tab before a pending debounce fires.
	useEffect(() => {
		const onHide = () => flush();
		window.addEventListener("pagehide", onHide);
		document.addEventListener("visibilitychange", onHide);
		return () => {
			window.removeEventListener("pagehide", onHide);
			document.removeEventListener("visibilitychange", onHide);
		};
	}, [flush]);

	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent) => {
			if ((event.metaKey || event.ctrlKey) && event.key === "s") {
				event.preventDefault();
				flush();
			}
		};

		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [flush]);

	useEffect(() => {
		setConfirmingDelete(false);
	}, [activeId]);

	// Focus after the new note is committed — the textarea does not exist yet
	// when a note is created from the empty state.
	useEffect(() => {
		if (!pendingFocusId) {
			return;
		}
		textareaRef.current?.focus();
		setPendingFocusId(null);
	}, [pendingFocusId]);

	const sortedNotes = useMemo(
		() => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
		[notes],
	);

	const visibleNotes = useMemo(() => {
		const search = query.trim().toLowerCase();
		if (!search) {
			return sortedNotes;
		}

		return sortedNotes.filter(note =>
			`${note.title}\n${note.content}`.toLowerCase().includes(search),
		);
	}, [sortedNotes, query]);

	const activeNote = notes.find(note => note.id === activeId) ?? null;

	const updateActiveNote = (
		patch: Pick<Note, "title"> | Pick<Note, "content">,
	) => {
		if (!activeId) {
			return;
		}

		setSaveState("saving");
		setNotes(current =>
			current.map(note =>
				note.id === activeId ?
					{ ...note, ...patch, updatedAt: Date.now() }
				:	note,
			),
		);
	};

	const handleNewNote = () => {
		const note = createNote();
		setSaveState("saving");
		setNotes(current => [note, ...current]);
		setActiveId(note.id);
		setQuery("");
		setMobilePane("editor");
		setPendingFocusId(note.id);
	};

	const handleSelectNote = (id: string) => {
		setActiveId(id);
		setMobilePane("editor");
	};

	const handleDeleteNote = () => {
		if (!activeNote) {
			return;
		}

		if (!confirmingDelete) {
			setConfirmingDelete(true);
			return;
		}

		const remaining = sortedNotes.filter(note => note.id !== activeNote.id);
		setSaveState("saving");
		setNotes(current => current.filter(note => note.id !== activeNote.id));
		setActiveId(remaining[0]?.id ?? null);
		setConfirmingDelete(false);
		if (!remaining.length) {
			setMobilePane("list");
		}
	};

	return (
		<main className="flex h-dvh w-full overflow-hidden">
			<h1 className="sr-only">Notepad</h1>

			<aside
				className={cn(
					"border-border w-full shrink-0 flex-col sm:flex sm:w-[280px] sm:border-r",
					mobilePane === "list" ? "flex" : "hidden",
				)}>
				<div className="border-border flex h-14 items-center gap-2 border-b px-2">
					<div className="relative flex-1">
						<Search className="text-muted-foreground/70 pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2" />
						<input
							type="search"
							value={query}
							onChange={event => setQuery(event.target.value)}
							placeholder="Search notes"
							aria-label="Search notes"
							className="placeholder:text-muted-foreground/70 focus-visible:border-ring h-8 w-full rounded-md border border-transparent bg-transparent pr-2 pl-7 text-sm outline-none"
						/>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={handleNewNote}
						aria-label="New note"
						title="New note"
						className="size-8 shrink-0">
						<Plus className="size-4" />
					</Button>
				</div>

				<div className="flex-1 overflow-y-auto">
					{visibleNotes.length ?
						<ul>
							{visibleNotes.map(note => (
								<li key={note.id}>
									<button
										type="button"
										onClick={() =>
											handleSelectNote(note.id)
										}
										className={cn(
											"border-border/60 hover:bg-secondary/40 w-full border-b px-3 py-2.5 text-left transition-colors",
											note.id === activeId &&
												"bg-secondary/60",
										)}>
										<span
											className={cn(
												"block truncate text-sm",
												note.id === activeId ?
													"text-foreground"
												:	"text-gray-1100",
											)}>
											{noteTitle(note)}
										</span>
										<span className="text-muted-foreground/70 mt-0.5 block truncate text-xs">
											{notePreview(note)}
										</span>
										<span className="text-muted-foreground/60 mt-1 block text-xs">
											{formatDistanceToNowStrict(
												note.updatedAt,
												{ addSuffix: true },
											)}
										</span>
									</button>
								</li>
							))}
						</ul>
					:	<p className="text-muted-foreground/70 p-3 text-sm">
							{query.trim() ?
								"No notes match that search."
							:	"No notes yet."}
						</p>
					}
				</div>
			</aside>

			<section
				className={cn(
					"w-full min-w-0 flex-1 flex-col sm:flex",
					mobilePane === "editor" ? "flex" : "hidden",
				)}>
				{activeNote ?
					<>
						<div
							className={`border-border flex h-14 shrink-0 items-center gap-2 border-b ${COLUMN_PADDING}`}>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								onClick={() => setMobilePane("list")}
								aria-label="Back to notes"
								className="size-8 shrink-0 sm:hidden">
								<ChevronLeft className="size-4" />
							</Button>
							<input
								value={activeNote.title}
								onChange={event =>
									updateActiveNote({
										title: event.target.value,
									})
								}
								placeholder="Untitled"
								aria-label="Note title"
								className="placeholder:text-muted-foreground/70 text-foreground min-w-0 flex-1 bg-transparent text-base outline-none"
							/>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								onClick={handleDeleteNote}
								onBlur={() => setConfirmingDelete(false)}
								aria-label="Delete note"
								className={cn(
									"h-8 shrink-0",
									confirmingDelete &&
										"text-destructive-foreground hover:text-destructive-foreground",
								)}>
								<Trash2 className="size-4" />
								{confirmingDelete ? "Confirm" : null}
							</Button>
						</div>

						<textarea
							ref={textareaRef}
							value={activeNote.content}
							onChange={event =>
								updateActiveNote({
									content: event.target.value,
								})
							}
							placeholder="Start typing…"
							aria-label="Note content"
							spellCheck
							className={`text-gray-1100 placeholder:text-muted-foreground/70 w-full flex-1 resize-none bg-transparent py-6 text-base leading-7 outline-none ${COLUMN_PADDING}`}
						/>

						<div
							className={`border-border text-muted-foreground/70 flex shrink-0 items-center justify-between gap-3 border-t py-2 text-xs ${COLUMN_PADDING}`}>
							<span>
								{countWords(activeNote.content)} words •{" "}
								{activeNote.content.length} characters
							</span>
							<span>
								{saveState === "error" ?
									"Could not save — storage is unavailable"
								: saveState === "saving" ?
									"Saving…"
								: saveState === "saved" ?
									"Saved locally"
								:	null}
							</span>
						</div>
					</>
				:	<div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
						<p className="text-muted-foreground text-base">
							No note selected.
						</p>
						<Button type="button" onClick={handleNewNote}>
							<Plus className="size-4" />
							New note
						</Button>
					</div>
				}
			</section>
		</main>
	);
}
