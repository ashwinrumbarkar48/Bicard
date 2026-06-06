import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { PageLoader } from './Spinner';

// Section heading used across pages.
export function SectionHeading({ eyebrow, title, subtitle, center }) {
  return (
    <div className={center ? 'text-center max-w-2xl mx-auto' : ''}>
      {eyebrow && (
        <span className={`eyebrow ${center ? 'justify-center' : ''}`}>{eyebrow}</span>
      )}
      <h2 className="text-2xl md:text-[2rem] leading-tight font-extrabold mt-2">{title}</h2>
      {subtitle && <p className="text-ink-light mt-3 text-base md:text-lg">{subtitle}</p>}
    </div>
  );
}

// Thin decorative gradient divider.
export function SectionDivider() {
  return <div className="h-1 w-20 rounded-full bg-gradient-to-r from-brand to-highlight" />;
}

// Udemy-style star rating row.
export function StarRating({ value = 0, count }) {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) stars.push(<FaStar key={i} />);
    else if (value >= i - 0.5) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="font-extrabold text-ink text-sm">{Number(value).toFixed(1)}</span>
      <span className="flex text-sm text-highlight-600">{stars}</span>
      {count != null && <span className="text-ink-light text-xs">({count})</span>}
    </span>
  );
}

export function Loader({ label = 'Loading' }) {
  return <PageLoader label={label} />;
}

export function EmptyState({ message = 'Nothing to show yet.' }) {
  return <div className="text-center py-16 text-ink-light">{message}</div>;
}

export function ErrorState({ message = 'Failed to load content.' }) {
  return <div className="text-center py-16 text-accent font-semibold">{message}</div>;
}
