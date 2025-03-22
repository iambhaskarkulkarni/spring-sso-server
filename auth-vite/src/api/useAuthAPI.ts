import { useMutation } from '@tanstack/react-query';
import { apiService } from './apiService'; // Adjust the import path as needed
import { useNavigate } from 'react-router';
import { generateCodeChallenge, generateCodeVerifier } from '../utils/authUtils';

export const useLogin = () => {
  return useMutation({
    mutationFn: async () => {
      console.log('Firing the login request...');

      // Generate code_verifier and code_challenge
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      // Save code_verifier in session storage for later use
      sessionStorage.setItem('code_verifier', codeVerifier);

      return codeChallenge;
    },
    onSuccess: (codeChallenge) => {
      // Redirect to authorization server
      const authUrl = new URL('http://localhost:8080/oauth2/authorize');
      const params = {
        response_type: 'code',
        client_id: 'public-client',
        redirect_uri: 'http://localhost:5175/callback',
        scope: 'openid email',
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
      };
      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

// Hook for exchanging authorization code for token
export const useExchangeCodeForToken = () => {
  return useMutation({
    mutationFn: ({ code, codeVerifier }: { code: string; codeVerifier: string }) =>
      apiService.exchangeCodeForToken(code, codeVerifier),
    onSuccess: (data) => {
      console.log('Token exchange successful:', data.access_token);
      sessionStorage.setItem('token', data.access_token); // Store the token
    },
    onError: (error) => {
      console.error('Token exchange failed:', error);
    },
  });
};

// Hook for logging out
export const useLogout = (setSession: (session: any) => void) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => apiService.logout(),
    onSuccess: () => {
      console.log('Logout successful');
      sessionStorage.removeItem('token'); // Clear the token
      setSession(null);
      navigate('/sign-in');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};