import { Trash2 } from "lucide-react"
import type { Note } from "@/hooks/useNotes"

type NoteItemProps = {
  note: Note
  onDelete?: () => void
  onClick?: () => void
}

export function NoteItem({ note, onDelete, onClick }: NoteItemProps) {
  return (
    <div 
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex-1">
        <p className="text-gray-800 font-medium">{note.title}</p>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(note.updatedAt).toLocaleDateString()}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.()
        }}
        className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label={`Delete ${note.title}`}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}
