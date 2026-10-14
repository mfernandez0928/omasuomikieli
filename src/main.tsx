import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './styles/global.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root is missing from index.html.');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Registers the service worker that makes the app work offline.
// autoUpdate means a new version activates on the next visit.
registerSW({ immediate: true });

if (import.meta.env.DEV) {
  // Surface content problems during development instead of shipping them.
  void (async () => {
    const { validateWords } = await import('./data/words');
    const issues = validateWords();
    if (issues.length) {
      console.warn(`[oma-suomi] ${issues.length} content issue(s):`);
      for (const i of issues) console.warn(` - ${i.kind}: ${i.detail}`);
    }
  })();
}
