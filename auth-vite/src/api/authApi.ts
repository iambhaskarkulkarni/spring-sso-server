import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { generateCodeChallenge, generateCodeVerifier } from '../utils/authUtils';

// Define the Auth API with RTK Query
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8080' }),
  endpoints: (builder) => ({
    // Using a proper mutation with fixed return types
    initiateLogin: builder.mutation<void, void>({
      queryFn: async () => {
        try {
          console.log('Firing the login request...');

          // Generate code_verifier and code_challenge
          const codeVerifier = generateCodeVerifier();
          const codeChallenge = await generateCodeChallenge(codeVerifier);

          // Save code_verifier in session storage for later use
          sessionStorage.setItem('code_verifier', codeVerifier);

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

          // Return a successful result with correct type
          return { data: undefined };
        } catch (error) {
          // Return error with the correct RTK Query error type
          return {
            error: {
              status: 'CUSTOM_ERROR',
              error: String(error)
            } as FetchBaseQueryError
          };
        }
      },
    }),

    exchangeCodeForToken: builder.mutation({
      query: ({ code, codeVerifier }) => {
        const params = new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: 'http://localhost:5175/callback',
          client_id: 'public-client',
          code_verifier: codeVerifier,
        });

        return {
          url: '/oauth2/token',
          method: 'POST',
          body: params.toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        };
      },
    }),
  }),
});

// Export the hooks
export const {
  useInitiateLoginMutation,
  useExchangeCodeForTokenMutation
} = authApi;

// Custom hook for better developer experience
export const useLogin = () => {
  const [initiateLogin, { isLoading, error }] = useInitiateLoginMutation();

  return {
    login: initiateLogin,
    isLoading,
    error
  };
};