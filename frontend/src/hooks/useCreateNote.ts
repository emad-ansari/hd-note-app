import { useState, useCallback } from 'react'
import { useNotes } from './useNotes'

export const useCreateNote = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  })
  const [formError, setFormError] = useState<string | null>(null)
  const { createNote, loading } = useNotes()

  const handleInputChange = useCallback((field: 'title' | 'content', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear form error when user starts typing
    if (formError) {
      setFormError(null)
    }
  }, [formError])

  const handleSubmit = useCallback(async () => {
    // Clear previous errors
    setFormError(null)
    
    if (!formData.title.trim() || !formData.content.trim()) {
      const error = 'Title and content are required'
      setFormError(error)
      return { success: false, error }
    }

    const result = await createNote({
      title: formData.title.trim(),
      content: formData.content.trim(),
    })

    if (result.success) {
      // Reset form
      setFormData({ title: '', content: '' })
      setFormError(null)
      return { success: true, note: result.note }
    } else {
      // Set form error for display
      setFormError(result.error || 'Failed to create note')
      return result
    }
  }, [formData, createNote])

  const resetForm = useCallback(() => {
    setFormData({ title: '', content: '' })
    setFormError(null)
  }, [])

  return {
    formData,
    loading,
    formError,
    handleInputChange,
    handleSubmit,
    resetForm,
  }
}
