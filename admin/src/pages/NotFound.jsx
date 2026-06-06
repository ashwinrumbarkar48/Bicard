import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center bg-paper text-center px-4">
      <div>
        <div className="text-7xl font-extrabold text-brand">404</div>
        <p className="text-ink-light mt-3">Page not found.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Back to Dashboard</Link>
      </div>
    </div>
  );
}
