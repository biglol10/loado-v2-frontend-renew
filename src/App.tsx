import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './apis/utils/queryClient';
import MockProvider from './screen-control/MockProvider';
import { BrowserRouter } from 'react-router-dom';
import Router from './routers';
import BrowserActivity from './components/atomic/BrowserActivity';

function App() {
  const isLocal = process.env.MODE === 'local';
  const isUseMsw = process.env.USE_MSW === 'true';

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <>
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
    </>
  );
}

export default App;
