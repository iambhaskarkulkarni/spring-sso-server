import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import type { Navigation, Session } from '@toolpad/core/AppProvider';
import { SessionContext } from './SessionContext';
import { createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import { useLogout } from './api/useAuthAPI';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'Users',
    icon: <ShoppingCartIcon />,
  },
];

const BRANDING = {
  logo: <img src="/spring.png" alt="MUI logo" />,
  title: 'Spring Authorization Server',
};

export default function App() {
  const [session, setSession] = React.useState<Session | null>(null);
  const navigate = useNavigate();
  const { mutate, isPending, isSuccess, isError, error } = useLogout(setSession);


  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = async () => {
    mutate()
  };

  const demoTheme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#6DB33F', // Spring Boot green (primary color)
          },
          secondary: {
            main: '#34302D', // Dark gray (secondary color)
          },
          background: {
            default: '#FFFFFF', // White background
            paper: '#F5F5F5', // Light gray for paper components
          },
          text: {
            primary: '#34302D', // Dark gray for primary text
            secondary: '#6DB33F', // Spring Boot green for secondary text
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: '#6DB33F', // Spring Boot green (primary color)
          },
          secondary: {
            main: '#FFFFFF', // White (secondary color)
          },
          background: {
            default: '#121212', // Dark background
            paper: '#1E1E1E', // Darker gray for paper components
          },
          text: {
            primary: '#FFFFFF', // White for primary text
            secondary: '#6DB33F', // Spring Boot green for secondary text
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });



  const sessionContextValue = React.useMemo(() => ({ session, setSession }), [session, setSession]);

  return (
    <SessionContext.Provider value={sessionContextValue}>
      <ReactRouterAppProvider
        navigation={NAVIGATION}
        branding={BRANDING}
        session={session}
        theme={demoTheme}
        authentication={{ signIn, signOut }}
      >
        <Outlet />
      </ReactRouterAppProvider>
    </SessionContext.Provider>
  );
}
