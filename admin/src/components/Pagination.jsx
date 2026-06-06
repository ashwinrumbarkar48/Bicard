export default function Pagination({ pagination, onChange }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const { page, totalPages, hasPrevPage, hasNextPage, total } = pagination;

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <span className="text-ink-light">{total} record(s)</span>
      <div className="flex items-center gap-2">
        <button className="btn-outline px-3 py-1.5" disabled={!hasPrevPage} onClick={() => onChange(page - 1)}>
          Prev
        </button>
        <span className="text-ink-light px-2">Page {page} / {totalPages}</span>
        <button className="btn-outline px-3 py-1.5" disabled={!hasNextPage} onClick={() => onChange(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
