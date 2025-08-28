import { useState } from "react";
import HdLogo from "@/assets/icon.png";
import { NoteItem } from "@/components/common/note-item";
import { Input } from "@/components/ui/input";

type Note = { id: string; title: string };

export default function DashboardPage() {
	const [noteTitle, setNoteTitle] = useState<string>("");
	const [notes, setNotes] = useState<Note[]>([
		{ id: "1", title: "Note 1" },
		{ id: "2", title: "Note 2" },
	]);

	function addNote() {
		if (noteTitle == "") return;
		setNotes((prev) => [
			...prev,
			{ id: crypto.randomUUID(), title: noteTitle },
		]);
		setNoteTitle("");
	}

	function deleteNote(id: string) {
		setNotes((prev) => prev.filter((n) => n.id !== id));
	}

	return (
		<main className="min-h-[100dvh] bg-background text-foreground">
			<header
				className="
          mx-auto w-full 
          max-w-md px-4 py-6 
          sm:px-6 
          md:max-w-5xl md:px-8 md:py-8 
          lg:max-w-6xl 
          mb-2 md:mb-4
          flex items-center justify-between
        "
			>
				<div className="flex items-center gap-2">
					<img src={HdLogo} alt="" />
					<h1 className="text-lg font-semibold md:text-xl">
						Dashboard
					</h1>
				</div>

				<button
					type="button"
					className="text-sm font-medium text-blue-600 hover:underline md:text-base"
					onClick={() => {
						// In a real app, hook up auth sign-out logic here.
					}}
				>
					Sign Out
				</button>
			</header>

			<div
				className="
                mx-auto w-full 
                max-w-md px-4 py-6 
                sm:px-6 
                md:max-w-2xl md:py-10 
                lg:max-w-3xl
            "
			>
				<section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white px-3 py-4 shadow-md mb-5">
					<p className="text-xl font-semibold text-[#232323] md:text-2xl">
						Welcome, Jonas Khanwald !
					</p>
					<p className="mt-1 text-[#232323]">
						Email: xxxxxx@xxxx.com
					</p>
				</section>

				<Input
					placeholder="Note"
					type="text"
					className="py-5 border border-[#367AFF] focus-visible:ring-[#367AFF]/50 focus-visible:border-[#367AFF]"
					value={noteTitle}
					onChange={(e) => setNoteTitle(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") addNote();
					}}
				/>
				<div className="mt-6">
					<button
						type="button"
						onClick={addNote}
						className="
                            h-12 w-full rounded-lg 
                            bg-blue-600 text-white 
                            font-medium 
                            hover:bg-blue-700 
                            transition-colors
                            "
					>
						Create Note
					</button>
				</div>

				<section className="mt-6">
					<h2 className="text-lg font-semibold text-gray-900">
						Notes
					</h2>
					<div className="mt-3 space-y-3">
						{notes.map((note) => (
							<NoteItem
								key={note.id}
								title={note.title}
								onDelete={() => deleteNote(note.id)}
							/>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
