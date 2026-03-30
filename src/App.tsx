import { GlobalErrorFallback } from '@/components/errorFallBack/globalErrorFallBack';
import { routes } from '@/router/routes';
import { ReactQueryProvider } from '@/services/react-query/provider';
import {
  createTheme,
  CssBaseline,
  GlobalStyles,
  ThemeProvider,
} from '@mui/material';
import { ErrorBoundary } from 'react-error-boundary';
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

const router = createBrowserRouter(routes as RouteObject[]);

const theme = createTheme({
  typography: {
    fontFamily:
      '"Ubuntu", system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
  },
});

const App = () => {
  return (
    <ReactQueryProvider>
      <ErrorBoundary
        FallbackComponent={GlobalErrorFallback}
        onReset={() => window.location.replace('/')}
      >
        <ThemeProvider theme={theme}>
          <ToastContainer position="top-center" autoClose={1500} />
          <CssBaseline />
          <GlobalStyles
            styles={{
              html: { height: '100%', width: '100%' },
              body: {
                margin: 0,
                padding: 0,
                height: '100%',
                width: '100%',
                fontFamily:
                  '"Ubuntu", system-ui, -apple-system, "Segoe UI", Arial, sans-serif',
                backgroundColor: '#f0f0f0',
              },
              '#root': {
                height: '100%',
                width: '100%',
              },
            }}
          />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ErrorBoundary>
    </ReactQueryProvider>
  );
};

export default App;
