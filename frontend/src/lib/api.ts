const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// if (import.meta.env.VITE_ENV === "development") {
// 	API_BASE_URL = import.meta.env.VITE_LOCALHOST_URL;
// } else {
// 	API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// }

console.log('this is backend url: ', API_BASE_URL);

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = {
          ...config.headers,
          'Authorization': `Bearer ${token}`,
        };
      }

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed',
          errors: data.errors || [],
        };
      }

      return {
        success: true,
        data,
        message: data.message,
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Auth endpoints
  async signup(userData: {
    username: string;
    email: string;
    dateOfBirth: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async verifyOtp(email: string, otp: string): Promise<ApiResponse> {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async login(email: string): Promise<ApiResponse> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyLoginOtp(email: string, otp: string): Promise<ApiResponse> {
    return this.request('/auth/verify-login-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse> {
    return this.request('/user/profile');
  }

  // Notes endpoints
  async createNote(noteData: { title: string; content: string }): Promise<ApiResponse> {
    return this.request('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
  }

  async getUserNotes(params?: {
    page?: number;
    limit?: number;
    search?: string;
    archived?: boolean;
  }): Promise<ApiResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.archived !== undefined) queryParams.append('archived', params.archived.toString());

    const endpoint = `/notes${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(endpoint);
  }

  async getNote(noteId: string): Promise<ApiResponse> {
    return this.request(`/notes/${noteId}`);
  }

  async updateNote(noteId: string, noteData: { title?: string; content?: string }): Promise<ApiResponse> {
    return this.request(`/notes/${noteId}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
  }

  async deleteNote(noteId: string): Promise<ApiResponse> {
    return this.request(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  }

  async toggleNoteArchive(noteId: string): Promise<ApiResponse> {
    return this.request(`/notes/${noteId}/archive`, {
      method: 'PATCH',
    });
  }
}

export const apiService = new ApiService();
export type { ApiResponse };
