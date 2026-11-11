import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import PartnerPage from './components/PartnerPage.tsx';
import ReviewsPage from './components/ReviewsPage.tsx';
import './styles.css';

const path = typeof window !== 'undefined' ? window.location.pathname : '/';
const isPartner = path === '/partners' || path.startsWith('/partners/') || path === '/partners.html';
const isReviews = path === '/reviews' || path.startsWith('/reviews/') || path === '/reviews.html';

const RootComponent = isPartner ? PartnerPage : isReviews ? ReviewsPage : App;

const rootEl = document.getElementById('root')!;
if (rootEl.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootEl,
    <React.StrictMode>
      <RootComponent />
    </React.StrictMode>,
  );
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <RootComponent />
    </React.StrictMode>,
  );
}
