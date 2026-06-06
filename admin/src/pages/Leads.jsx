import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaDownload, FaEye, FaTrash } from 'react-icons/fa';
import api from '../services/api';
import { PageHeader, Loading, EmptyState, StatusBadge } from '../components/ui';
import Modal, { ConfirmDialog } from '../components/Modal';
import Pagination from '../components/Pagination';

const STATUSES = ['new', 'contacted', 'converted', 'lost'];

export default function Leads() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [active, setActive] = useState(null);
  const [note, setNote] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/leads', { params: { page, limit: 10, status: statusFilter } });
      setRows(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      const res = await api.patch(`/leads/${id}/status`, { status });
      toast.success('Status updated');
      setRows((r) => r.map((l) => (l._id === id ? res.data.data : l)));
      if (active?._id === id) setActive(res.data.data);
    } catch {
      toast.error('Update failed');
    }
  };

  const addNote = async () => {
    if (!note.trim()) return;
    try {
      const res = await api.post(`/leads/${active._id}/notes`, { text: note });
      setActive(res.data.data);
      setNote('');
      toast.success('Note added');
    } catch {
      toast.error('Failed to add note');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/leads/${deleteId}`);
      toast.success('Lead deleted');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const exportCsv = async () => {
    try {
      const res = await api.get('/leads/export', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bicard-leads.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed');
    }
  };

  return (
    <div>
      <PageHeader
        title="Leads"
        subtitle="Inquiries from the website"
        action={<button onClick={exportCsv} className="btn-primary"><FaDownload /> Export CSV</button>}
      />

      <div className="card p-4 mb-4 flex gap-2 flex-wrap">
        <button onClick={() => { setStatusFilter(''); setPage(1); }} className={`badge px-3 py-1.5 ${!statusFilter ? 'bg-brand text-white' : 'bg-gray-100 text-ink-light'}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={`badge px-3 py-1.5 capitalize ${statusFilter === s ? 'bg-brand text-white' : 'bg-gray-100 text-ink-light'}`}>{s}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <Loading />
        ) : rows.length === 0 ? (
          <EmptyState message="No leads yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-ink-light text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Course</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{l.name}</td>
                    <td className="px-4 py-3 text-ink-light">
                      <div>{l.email}</div>
                      <div>{l.mobile}</div>
                    </td>
                    <td className="px-4 py-3">{l.course || '—'}</td>
                    <td className="px-4 py-3 text-xs">{l.source}</td>
                    <td className="px-4 py-3">
                      <select
                        value={l.status}
                        onChange={(e) => updateStatus(l._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1 capitalize"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => setActive(l)} className="btn-ghost p-2 text-brand"><FaEye /></button>
                        <button onClick={() => setDeleteId(l._id)} className="btn-ghost p-2 text-accent"><FaTrash /></button>
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

      {/* Detail modal */}
      <Modal open={!!active} onClose={() => setActive(null)} title="Lead Details" size="md">
        {active && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Detail label="Name" value={active.name} />
              <Detail label="Status" value={<StatusBadge value={active.status} />} />
              <Detail label="Email" value={active.email} />
              <Detail label="Mobile" value={active.mobile} />
              <Detail label="Course" value={active.course} />
              <Detail label="Source" value={active.source} />
            </div>
            {active.message && (
              <div>
                <div className="label">Message</div>
                <p className="bg-gray-50 rounded-lg p-3 text-sm">{active.message}</p>
              </div>
            )}

            <div>
              <div className="label">Notes</div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {(active.notes || []).length === 0 && <p className="text-ink-light text-sm">No notes yet.</p>}
                {(active.notes || []).map((n, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2 text-sm">
                    {n.text}
                    <div className="text-ink-light text-xs mt-0.5">{n.createdAt && new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <input className="input" placeholder="Add a note…" value={note} onChange={(e) => setNote(e.target.value)} />
                <button onClick={addNote} className="btn-primary">Add</button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete lead?"
        message="This will remove the lead from the list."
      />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-ink-light text-xs">{label}</div>
      <div className="font-semibold">{value || '—'}</div>
    </div>
  );
}
