import { FaTimes } from 'react-icons/fa';

export default function Modal({ open, onClose, title, children, size = 'lg' }) {
  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-2xl', xl: 'max-w-4xl' };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50">
      <div className={`card w-full ${widths[size]} my-8`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button onClick={onClose} className="text-ink-light hover:text-ink text-lg" aria-label="Close">
            <FaTimes />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = 'Are you sure?', message, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/50">
      <div className="card w-full max-w-sm p-6 text-center">
        <h3 className="text-lg font-extrabold">{title}</h3>
        {message && <p className="text-ink-light text-sm mt-2">{message}</p>}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-outline flex-1">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="btn-accent flex-1">
            {loading ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
