import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from './apis/utils/queryClient';
import MockProvider from './screen-control/MockProvider';
import { BrowserRouter } from 'react-router-dom';
import Router from './routers';
import BrowserActivity from './screen-control/BrowserActivity';
import { I18nextProvider } from 'react-i18next';
import i18n from './locales/i18n';
import { Toaster } from 'react-hot-toast';
import useHandleError from './utils/hooks/useHandleError';

function App() {
  const isLocal = process.env.MODE === 'local';
  const isUseMsw = process.env.USE_MSW === 'true';

  const { handleError } = useHandleError();
  const queryClient = getQueryClient(handleError);

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <MockProvider enable={isLocal && isUseMsw}>
              <BrowserRouter>
                <Router />
                {/* <RouterProvider router={rootRouer} /> */}
                <BrowserActivity />
              </BrowserRouter>
            </MockProvider>
          </QueryClientProvider>
        </ThemeProvider>
      </I18nextProvider>
    </>
  );
}

export default App;
