import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="container-bicard py-28 text-center">
      <SEO title="Page Not Found" />
      <div className="text-7xl font-extrabold text-brand">404</div>
      <h1 className="text-2xl font-bold mt-4">Page not found</h1>
      <p className="text-ink-light mt-2">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
