import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Note } from "@/hooks/useNotes"

type NoteDetailsProps = {
  note: Note
  onBack: () => void
}

export function NoteDetails({ note, onBack }: NoteDetailsProps) {
  return (
    <div className="w-full">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-gray-900">Note Details</h2>
      </div>

      {/* Note content */}
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            {note.title}
          </h3>
          <div className="text-gray-700 whitespace-pre-wrap">
            {note.content || "No content available"}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            <p>Created: {new Date(note.createdAt).toLocaleDateString()}</p>
            <p>Updated: {new Date(note.updatedAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
