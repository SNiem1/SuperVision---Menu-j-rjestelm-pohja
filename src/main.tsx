import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ReviewsProvider } from './context/ReviewsContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ReviewsProvider>
        <App />
      </ReviewsProvider>
    </ErrorBoundary>
  </StrictMode>,
);
