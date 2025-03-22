'use client';
import * as React from 'react';
import { SignInPage } from '@toolpad/core/SignInPage';
import type { Session } from '@toolpad/core/AppProvider';
import { useNavigate } from 'react-router';
import { useSession } from '../SessionContext';
import { Backdrop, Box, Button, CircularProgress, Container, Paper, Typography } from '@mui/material';
import { generateCodeChallenge, generateCodeVerifier } from '../utils/authUtils';
import { useLogin } from '../api/authApi';

export default function SignIn() {
  const { setSession } = useSession();
  const navigate = useNavigate();
  const requestFired = React.useRef(false); // Ref to track if the request has been fired
  const {login, isLoading, error} = useLogin();

  React.useEffect(() => {
    if (!requestFired.current) {
      console.log('Component loaded. Firing request...');
      login();
      requestFired.current = true; // Mark the request as fired
    }
  }, []);


  return (
    <div style={{ position: 'relative' }}>
    {/* Loading mask */}
    <Backdrop
      sx={{ color: '#fff'}}
      // open={isLoading} // Show the backdrop when isLoading is true
    >
      <CircularProgress color="inherit" /> {/* Loading spinner */}
    </Backdrop>
  </div>
  );
}