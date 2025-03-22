import { AxiosError, AxiosResponse } from 'axios';
import api from './api'; // Your Axios instance or fetch wrapper
import { ErrorResponse, TokenResponse } from '../type';

// Add global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError<ErrorResponse>) => {
    if (error.response) {
      console.error('API Error:', error.response.data.message);
      throw new Error(error.response.data.message || 'An error occurred');
    } else {
      console.error('Network Error:', error.message);
      throw new Error('Network error. Please check your connection.');
    }
  },
);

// Centralized API calls
export const apiService = {
  // Exchange authorization code for token
  exchangeCodeForToken: async (code: string, codeVerifier: string) => {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:5175/callback',
      client_id: 'public-client',
      code_verifier: codeVerifier,
    });

    const response: AxiosResponse = await api.post('/oauth2/token', params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data; // Return raw response data
  },

  // Logout
  logout: async () => {
    await api.post(
      '/logout',
      {},
      {
        withCredentials: true, // Include cookies (if using session-based auth)
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`, // Include the access token
        },
      },
    );
  },
};