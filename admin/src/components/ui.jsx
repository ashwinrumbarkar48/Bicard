import { FaPlus, FaSpinner } from 'react-icons/fa';

export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {subtitle && <p className="text-ink-light text-sm mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function AddButton({ onClick, label = 'Add New' }) {
  return (
    <button onClick={onClick} className="btn-primary">
      <FaPlus /> {label}
    </button>
  );
}

export function Spinner({ className = '' }) {
  return <FaSpinner className={`animate-spin ${className}`} />;
}

export function Loading({ label = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-16 text-ink-light gap-2">
      <Spinner /> {label}
    </div>
  );
}

export function EmptyState({ message = 'No records found.' }) {
  return <div className="text-center py-16 text-ink-light">{message}</div>;
}

export function StatusBadge({ value }) {
  const map = {
    published: 'bg-brand-50 text-brand',
    draft: 'bg-gray-100 text-ink-light',
    new: 'bg-blue-50 text-blue-600',
    contacted: 'bg-highlight text-ink',
    converted: 'bg-brand-50 text-brand',
    lost: 'bg-accent-50 text-accent',
  };
  return <span className={`badge ${map[value] || 'bg-gray-100 text-ink-light'}`}>{value}</span>;
}
