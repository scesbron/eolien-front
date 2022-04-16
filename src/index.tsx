import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import App from './App';
import AppSetup from './containers/app-setup';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <AppSetup>
    <App />
  </AppSetup>,
);
