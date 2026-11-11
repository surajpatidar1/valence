import { renderToString } from 'react-dom/server';
import App from './App';
import PartnerPage from './components/PartnerPage';
import ReviewsPage from './components/ReviewsPage';

export function render(url = '/') {
  const isPartner = url === '/partners' || url.startsWith('/partners/') || url === '/partners.html';
  if (isPartner) {
    return renderToString(<PartnerPage />);
  }
  const isReviews = url === '/reviews' || url.startsWith('/reviews/') || url === '/reviews.html';
  if (isReviews) {
    return renderToString(<ReviewsPage />);
  }
  return renderToString(<App />);
}
