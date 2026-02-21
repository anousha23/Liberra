const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('access_token');
  
  const headers = {
    ...options.headers,
  };

  // Only add Content-Type for JSON requests
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
      throw new ApiError('Unauthorized', 401, null);
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new ApiError(
        data?.detail || data?.message || `Request failed with status ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message, 0, null);
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

export const logout = () => {
  localStorage.removeItem('access_token');
  window.location.href = '/login';
};
