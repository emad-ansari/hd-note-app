import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-toastify'
import { apiService } from '@/lib/api'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface NotesState {
  notes: Note[]
  loading: boolean
  error: string | null
  selectedNote: Note | null
}

export interface CreateNoteData {
  title: string
  content: string
}

export interface UpdateNoteData {
  title?: string
  content?: string
}

export const useNotes = () => {
  const [state, setState] = useState<NotesState>({
    notes: [],
    loading: false,
    error: null,
    selectedNote: null,
  })

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiService.getUserNotes()
      
      if (response.success && response.data?.notes) {
        setState(prev => ({
          ...prev,
          notes: response.data.notes.map((note: any) => ({
            id: note._id || note.id,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          })),
          loading: false,
        }))
      } else {
        const errorMsg = response.message || 'Failed to fetch notes'
        setState(prev => ({
          ...prev,
          error: errorMsg,
          loading: false,
        }))
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = 'Failed to fetch notes'
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }))
      toast.error(errorMsg);
    }
  }, [])

  // Create a new note
  const createNote = useCallback(async (noteData: CreateNoteData) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiService.createNote(noteData)
      
      if (response.success && response.data?.note) {
        const newNote = {
          id: response.data.note._id || response.data.note.id,
          title: response.data.note.title,
          content: response.data.note.content,
          createdAt: response.data.note.createdAt,
          updatedAt: response.data.note.updatedAt,
        }
        
        setState(prev => ({
          ...prev,
          notes: [newNote, ...prev.notes],
          loading: false,
        }))
        
        return { success: true, note: newNote }
      } else {
        const errorMsg = response.message || 'Failed to create note'
        setState(prev => ({
          ...prev,
          error: errorMsg,
          loading: false,
        }))
        toast.error(errorMsg);
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      const errorMsg = 'Failed to create note'
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }))
      toast.error(errorMsg);
      return { success: false, error: errorMsg }
    }
  }, [])

  // Update an existing note
  const updateNote = useCallback(async (noteId: string, noteData: UpdateNoteData) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiService.updateNote(noteId, noteData)
      
      if (response.success && response.data?.note) {
        const updatedNote = {
          id: response.data.note._id || response.data.note.id,
          title: response.data.note.title,
          content: response.data.note.content,
          createdAt: response.data.note.createdAt,
          updatedAt: response.data.note.updatedAt,
        }
        
        setState(prev => ({
          ...prev,
          notes: prev.notes.map(note => 
            note.id === noteId ? updatedNote : note
          ),
          selectedNote: prev.selectedNote?.id === noteId ? updatedNote : prev.selectedNote,
          loading: false,
        }))
        
        toast.success("Note updated successfully!");
        return { success: true, note: updatedNote }
      } else {
        const errorMsg = response.message || 'Failed to update note'
        setState(prev => ({
          ...prev,
          error: errorMsg,
          loading: false,
        }))
        toast.error(errorMsg);
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      const errorMsg = 'Failed to update note'
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }))
      toast.error(errorMsg);
      return { success: false, error: errorMsg }
    }
  }, [])

  // Delete a note
  const deleteNote = useCallback(async (noteId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiService.deleteNote(noteId)
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          notes: prev.notes.filter(note => note.id !== noteId),
          selectedNote: prev.selectedNote?.id === noteId ? null : prev.selectedNote,
          loading: false,
        }))
        
        return { success: true }
      } else {
        const errorMsg = response.message || 'Failed to delete note'
        setState(prev => ({
          ...prev,
          error: errorMsg,
          loading: false,
        }))
        toast.error(errorMsg);
        return { success: false, error: errorMsg }
      }
    } catch (error) {
      const errorMsg = 'Failed to delete note'
      setState(prev => ({
        ...prev,
        error: errorMsg,
        loading: false,
      }))
      toast.error(errorMsg);
      return { success: false, error: errorMsg }
    }
  }, [])

  // Select a note for viewing details
  const selectNote = useCallback((note: Note | null) => {
    setState(prev => ({ ...prev, selectedNote: note }))
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Load notes on mount
  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  return {
    // State
    notes: state.notes,
    loading: state.loading,
    error: state.error,
    selectedNote: state.selectedNote,
    
    // Actions
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    selectNote,
    clearError,
  }
}
