import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createDI } from './core/DI/DI.js';
import { DIProvider } from './core/DI/DIProvider.js';
import { GreetingPage } from './scenes/greeting/greeting.page.js';

const dependencies = createDI();
const root = document.getElementById('app');
if (!root) throw new Error('Application root is missing.');
createRoot(root).render(
  <StrictMode>
    <DIProvider dependencies={dependencies}><GreetingPage /></DIProvider>
  </StrictMode>,
);
