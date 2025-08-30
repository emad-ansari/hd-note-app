import { useState, useEffect, useCallback } from 'react'
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
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch notes',
          loading: false,
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch notes',
        loading: false,
      }))
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
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to create note',
          loading: false,
        }))
        return { success: false, error: response.message }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to create note',
        loading: false,
      }))
      return { success: false, error: 'Failed to create note' }
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
        
        return { success: true, note: updatedNote }
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to update note',
          loading: false,
        }))
        return { success: false, error: response.message }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to update note',
        loading: false,
      }))
      return { success: false, error: 'Failed to update note' }
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
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to delete note',
          loading: false,
        }))
        return { success: false, error: response.message }
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to delete note',
        loading: false,
      }))
      return { success: false, error: 'Failed to delete note' }
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
