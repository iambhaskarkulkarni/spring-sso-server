import { useEffect, useState } from 'react';
import { replace, useNavigate } from 'react-router';
import { useExchangeCodeForTokenMutation } from '../api/authApi';
import { useSession } from '../SessionContext';
import { UserSession } from '../type';

function OAuthCallback() {
  const navigate = useNavigate();
  const [exchangeCodeForToken, { isLoading }] = useExchangeCodeForTokenMutation();
  const [error, setError] = useState<string | null>(null);
  const {session, setSession} = useSession();

  useEffect(() => {
    const handleCallback = async () => {
      // Get the authorization code from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      // Get the code verifier from session storage
      const codeVerifier = sessionStorage.getItem('code_verifier');

      if (!code) {
        setError('No authorization code found in URL');
        return;
      }

      if (!codeVerifier) {
        setError('No code verifier found in session storage');
        return;
      }

      try {
        // Exchange the code for tokens
        const tokenData = await exchangeCodeForToken({
          code,
          codeVerifier
        }).unwrap();

        // Store tokens in localStorage or in your secure storage
        localStorage.setItem('access_token', tokenData.access_token);
        if (tokenData.refresh_token) {
          localStorage.setItem('refresh_token', tokenData.refresh_token);
        }

        // Store additional user info if available
        if (tokenData.id_token) {
          localStorage.setItem('id_token', tokenData.id_token);
        }

        // Clear the code verifier from session storage
        sessionStorage.removeItem('code_verifier');

        console.log('Token exchange successful from redux:', tokenData.access_token);
        sessionStorage.setItem('token', tokenData.access_token); // Store the token
        const mockUser: UserSession = {
          user: {
            id: '12345',
            name: 'Bhaskar Kulkarni',
            email: 'bhaskar@example.com',
            image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        };

        setSession(mockUser);
        navigate('/', { replace: true });
      } catch (err) {
        console.error('Failed to exchange code for token:', err);
        setError('Failed to complete authentication');
      }
    };

    handleCallback();
  }, [exchangeCodeForToken, navigate]);

  if (isLoading) {
    return <div>Completing login...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Processing authentication...</div>;
}

export default OAuthCallback;