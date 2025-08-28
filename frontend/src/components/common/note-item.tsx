import { Trash2 } from "lucide-react"

type NoteItemProps = {
  title: string
  onDelete?: () => void
}

export function NoteItem({ title, onDelete }: NoteItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <p className="text-gray-800">{title}</p>
      <button
        type="button"
        onClick={onDelete}
        className="rounded p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label={`Delete ${title}`}
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
}
