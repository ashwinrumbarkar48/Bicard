import { useEffect, useMemo, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import { getResource } from '../config/resources';
import { createResourceApi } from '../services/resource.service';
import { assetUrl } from '../services/api';
import { PageHeader, AddButton, Loading, EmptyState, StatusBadge } from '../components/ui';
import Modal, { ConfirmDialog } from '../components/Modal';
import ResourceForm from '../components/ResourceForm';
import Pagination from '../components/Pagination';

export default function ResourceCrud({ resourceKey }) {
  const resource = getResource(resourceKey);
  const apiClient = useMemo(
    () => createResourceApi(resource.endpoint, resource.imageField),
    [resource.endpoint, resource.imageField]
  );

  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  const [editing, setEditing] = useState(null); // record or {} for new
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.list({ page, limit: 10, search: query });
      setRows(res.data);
      setPagination(res.pagination);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [apiClient, page, query]);

  useEffect(() => {
    load();
  }, [load]);

  // Reset to first page / reload when switching resource.
  useEffect(() => {
    setPage(1);
    setQuery('');
    setSearch('');
  }, [resourceKey]);

  const handleSave = async (payload) => {
    setSubmitting(true);
    try {
      if (editing._id) {
        await apiClient.update(editing._id, payload);
        toast.success(`${resource.singular} updated`);
      } else {
        await apiClient.create(payload);
        toast.success(`${resource.singular} created`);
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiClient.remove(deleteId);
      toast.success(`${resource.singular} deleted`);
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  const renderCell = (row, col) => {
    const val = row[col.key];
    if (col.type === 'published') return val ? <StatusBadge value="published" /> : <StatusBadge value="draft" />;
    if (col.type === 'status') return <StatusBadge value={val} />;
    return <span className="line-clamp-1">{val ?? '—'}</span>;
  };

  return (
    <div>
      <PageHeader
        title={resource.label}
        subtitle={`Manage ${resource.label.toLowerCase()}`}
        action={<AddButton onClick={() => setEditing({})} label={`Add ${resource.singular}`} />}
      />

      <div className="card p-4 mb-4">
        <form
          onSubmit={(e) => { e.preventDefault(); setPage(1); setQuery(search.trim()); }}
          className="flex gap-2 max-w-md"
        >
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light text-sm" />
            <input className="input pl-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn-outline">Search</button>
        </form>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <Loading />
        ) : rows.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-ink-light text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold w-14">Image</th>
                  {resource.columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-semibold">{c.label}</th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row) => (
                  <tr key={row._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="h-10 w-10 rounded bg-gray-100 overflow-hidden grid place-items-center text-ink-light text-xs">
                        {row[resource.imageField] ? (
                          <img src={assetUrl(row[resource.imageField])} alt="" className="h-full w-full object-cover" />
                        ) : '—'}
                      </div>
                    </td>
                    {resource.columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 max-w-xs">{renderCell(row, c)}</td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setEditing(row)} className="btn-ghost p-2 text-brand" title="Edit"><FaEdit /></button>
                        <button onClick={() => setDeleteId(row._id)} className="btn-ghost p-2 text-accent" title="Delete"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination pagination={pagination} onChange={setPage} />

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?._id ? `Edit ${resource.singular}` : `Add ${resource.singular}`}
      >
        {editing && (
          <ResourceForm
            fields={resource.fields}
            record={editing._id ? editing : null}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title={`Delete ${resource.singular}?`}
        message="This action will soft-delete the record. It can be restored from the database if needed."
      />
    </div>
  );
}
