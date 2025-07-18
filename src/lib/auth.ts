import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoginResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  id?: string; // Optional since it might not be in all responses
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Helper function to set cookie
const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

// Helper function to remove cookie
const removeCookie = (name: string) => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Login function
export const loginAdmin = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/organizer/login`, { 
      email, 
      password 
    });
    
    const data = response.data;
    
    // Save token and user data to localStorage and cookies
    if (data.token) {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userData', JSON.stringify({
        id: data.id || 'unknown',
        email: data.email,
        name: data.username, // Map username to name for consistency
        role: data.role
      }));
      setCookie('authToken', data.token, 7); // 7 days
    }
    
    return data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    }
    throw new Error('Network error. Please check your connection.');
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
  removeCookie('authToken');
  window.location.href = '/login';
};

// Get current user data
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Get auth token
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Create axios instance with auth token
export const createAuthAxios = () => {
  const token = getAuthToken();
  
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

// Verify token validity (optional - can be used to check if token is still valid)
export const verifyToken = async () => {
  try {
    const authAxios = createAuthAxios();
    const response = await authAxios.get('/api/auth/verify');
    return response.data.success;
  } catch (error) {
    // If token is invalid, logout user
    logout();
    return false;
  }
}; 