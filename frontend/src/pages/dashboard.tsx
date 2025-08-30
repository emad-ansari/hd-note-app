import HdLogo from "@/assets/icon.png";
import { NoteItem } from "@/components/common/note-item";
import { NoteDetails } from "@/components/common/note-details";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { useNotes } from "@/hooks/useNotes";
import { useCreateNote } from "@/hooks/useCreateNote";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { toast } from "react-toastify";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@radix-ui/react-label";
import { Button } from "@/components/ui/button";
import type { Note } from "@/hooks/useNotes";

export default function DashboardPage() {
	const { logout, loading: logoutLoading } = useAuth()
	const { profile, loading: profileLoading, error: profileError } = useUser()
	
	const {
		notes,
		loading: notesLoading,
		error: notesError,
		selectedNote,
		deleteNote,
		selectNote,
		clearError: clearNotesError,
		fetchNotes,
	} = useNotes()

	const {
		formData,
		loading: createLoading,
		formError,
		handleInputChange,
		handleSubmit,
		resetForm,
	} = useCreateNote()

	// Check authentication on mount
	useEffect(() => {
		const token = localStorage.getItem('authToken')
		if (!token) {
			window.location.href = '/signin'
		}
	}, [])

	const handleCreateNote = async () => {
		const result = await handleSubmit()
		if (result.success) {
			// Reset form after successful creation
			resetForm()
			toast.success("Note created successfully!");
		} else {
			// You could add toast notification here
			const errorMessage = 'error' in result ? result.error : 'Unknown error'
			console.error('Failed to create note:', errorMessage)
			toast.error(`Failed to create note: ${errorMessage}`);
		}
	}

	const handleDeleteNote = async (id: string) => {
		const result = await deleteNote(id)
		if (result.success) {
			toast.success("Note deleted successfully!");
		} else {
			// You could add toast notification here
			console.error('Failed to delete note:', result.error)
			toast.error(`Failed to delete note: ${result.error || 'Unknown error'}`);
		}
	}

	const handleNoteClick = (note: Note) => {
		selectNote(note)
	}

	const handleBackToNotes = () => {
		selectNote(null)
	}

	const handleLogout = async () => {
		try {
			await logout()
			toast.success("Logged out successfully!");
		} catch (error) {
			toast.error("Logout failed. Please try again.");
		}
	}

	// Show loading state while profile is loading
	if (profileLoading) {
		return (
			<main className="min-h-[100dvh] bg-background text-foreground flex items-center justify-center">
				<div className="text-center">
					<p className="text-lg text-gray-600">Loading dashboard...</p>
				</div>
			</main>
		)
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
					onClick={handleLogout}
					disabled={logoutLoading}
					className="text-sm font-medium text-blue-600 hover:underline md:text-base disabled:opacity-50"
				>
					{logoutLoading ? 'Signing out...' : 'Sign Out'}
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
				{selectedNote ? (
					<NoteDetails note={selectedNote} onBack={handleBackToNotes} />
				) : (
					<>
						<section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white px-3 py-4 shadow-md mb-5">
							{profileError ? (
								<div className="text-center py-4">
									<p className="text-red-600 text-sm">Failed to load profile</p>
									<button
										onClick={() => window.location.reload()}
										className="text-blue-600 hover:underline text-xs mt-2"
									>
										Retry
									</button>
								</div>
							) : profile ? (
								<>
									<p className="text-xl font-semibold text-[#232323] md:text-2xl">
										Welcome, {profile.username}!
									</p>
									<p className="mt-1 text-[#232323]">
										Email: {profile.email}
									</p>
								</>
							) : (
								<div className="text-center py-4">
									<p className="text-gray-600">Loading profile...</p>
								</div>
							)}
						</section>

						{/* Error Display */}
						{notesError && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-red-700 text-sm">{notesError}</p>
								<button
									onClick={clearNotesError}
									className="text-red-600 hover:text-red-800 text-xs underline mt-1"
								>
									Dismiss
								</button>
							</div>
						)}

						<div className="flex items-center justify-center w-full mt-6">
							<Dialog >
								<DialogTrigger asChild>
									<button
										type="button"
										className="
											h-12 w-full rounded-lg 
											bg-[#367AFF] text-white 
											font-medium 
											hover:bg-blue-700 
											transition-colors
											"
									>
										Create Note
									</button>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="mb-3">Add New Note</DialogTitle>
										<DialogDescription className="space-y-3">
											{/* Form Error Display */}
											{formError && (
												<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
													<p className="text-red-700 text-sm">{formError}</p>
												</div>
											)}
											
											<div className="flex flex-col gap-2 items-start">
												<Label className="text-sm font-medium text-gray-600">Title</Label>
												<Input
													placeholder="Title"
													type="text"
													className="py-5 border border-gray-300 focus-visible:ring-[#367AFF]/50 focus-visible:border-[#367AFF] w-full"
													value={formData.title}
													onChange={(e) => handleInputChange('title', e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") handleCreateNote();
													}}
												/>
											</div>
											<div className="flex flex-col gap-2 items-start">
												<Label className="text-sm font-medium text-gray-600">Content</Label>
												<Textarea 
													placeholder="Your note content..."
													className="py-5 border border-gray-300 focus-visible:ring-[#367AFF]/50 focus-visible:border-[#367AFF] w-full" 
													value={formData.content}
													onChange={(e) => handleInputChange('content', e.target.value)}
													onKeyDown={(e) => {
														if (e.key === "Enter") handleCreateNote();
													}}
												/>
												<Button 
													onClick={handleCreateNote} 
													disabled={createLoading}
													className="w-full mt-3 bg-[#367AFF] text-white hover:bg-blue-500 disabled:opacity-50"
												>
													{createLoading ? 'Creating...' : 'Add Note'}
												</Button>
											</div>
										</DialogDescription>
									</DialogHeader>
								</DialogContent>
							</Dialog>
						</div>

						<section className="mt-6">
							<div className="flex items-center justify-between">
								<h2 className="text-lg font-semibold text-gray-900">
									Notes
								</h2>
								<button
									onClick={fetchNotes}
									disabled={notesLoading}
									className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
								>
									{notesLoading ? 'Refreshing...' : 'Refresh'}
								</button>
							</div>
							
							{notesLoading ? (
								<div className="mt-3 text-center py-8">
									<p className="text-gray-500">Loading notes...</p>
								</div>
							) : notes.length === 0 ? (
								<div className="mt-3 text-center py-8">
									<p className="text-gray-500">No notes yet. Create your first note!</p>
								</div>
							) : (
								<div className="mt-3 space-y-3">
									{notes.map((note) => (
										<NoteItem
											key={note.id}
											note={note}
											onDelete={() => handleDeleteNote(note.id)}
											onClick={() => handleNoteClick(note)}
										/>
									))}
								</div>
							)}
						</section>
					</>
				)}
			</div>
		</main>
	);
}
