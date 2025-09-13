import AppContextProvider from './contexts/app.context.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from './App.tsx';
import './index.css';
import './css/utilities.css';
import './css/dark-mode.css';
import './css/print.css';
import './css/layout.css';
import './css/responsive.css';
import './css/components/TaskItem.css';
import './css/components/Button.css';
import './css/components/Modal.css';
import './css/components/Sidebar.css';
import './css/components/TopBar.css';
import './css/animations.css';
import './css/reset.css';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchIntervalInBackground: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster richColors position='top-right' />
      <QueryClientProvider client={queryClient}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);