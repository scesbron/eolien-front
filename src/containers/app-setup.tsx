import React, { PropsWithChildren } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { AuthProvider } from './auth';

const queryClient = new QueryClient();

const AppSetup = ({ initialize = true, children }: PropsWithChildren<{ initialize?: boolean }>) => (
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialize={initialize}>{children}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

export default AppSetup;
