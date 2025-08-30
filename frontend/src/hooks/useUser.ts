import { useState, useEffect, useCallback } from 'react'
import { apiService } from '@/lib/api'

export interface UserProfile {
  id: string
  username: string
  email: string
  dateOfBirth: string
}

export interface UserState {
  profile: UserProfile | null
  loading: boolean
  error: string | null
}

export const useUser = () => {
  const [state, setState] = useState<UserState>({
    profile: null,
    loading: false,
    error: null,
  })

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const response = await apiService.getUserProfile()
      
      if (response.success && response.data?.user) {
        const userData = response.data.user
        setState(prev => ({
          ...prev,
          profile: {
            id: userData._id || userData.id,
            username: userData.username,
            email: userData.email,
            dateOfBirth: userData.dateOfBirth,
          },
          loading: false,
        }))
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to fetch profile',
          loading: false,
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to fetch profile',
        loading: false,
      }))
    }
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  // Load profile on mount
  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    fetchProfile,
    clearError,
  }
}
