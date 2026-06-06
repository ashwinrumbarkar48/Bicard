import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { PageHeader, AddButton, Loading, EmptyState } from '../components/ui';
import Modal, { ConfirmDialog } from '../components/Modal';

const ROLES = ['Super Admin', 'Admin', 'Counselor', 'Marketing'];

export default function Users() {
  const me = useSelector((s) => s.auth.user);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Admin' });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/users', { params: { limit: 100 } });
      setRows(res.data.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setForm({ name: '', email: '', password: '', role: 'Admin' });
    setEditing({});
  };
  const openEdit = (u) => {
    setForm({ name: u.name, email: u.email, password: '', role: u.role });
    setEditing(u);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing._id) {
        await api.put(`/users/${editing._id}`, { name: form.name, role: form.role, password: form.password || undefined });
        toast.success('User updated');
      } else {
        await api.post('/users', form);
        toast.success('User created');
      }
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteId}`);
      toast.success('User deleted');
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Delete failed');
    }
  };

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage admin & staff accounts" action={<AddButton onClick={openCreate} label="Add User" />} />

      <div className="card overflow-hidden">
        {loading ? (
          <Loading />
        ) : rows.length === 0 ? (
          <EmptyState />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-ink-light text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3 text-ink-light">{u.email}</td>
                  <td className="px-4 py-3"><span className="badge bg-brand-50 text-brand">{u.role}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(u)} className="btn-ghost p-2 text-brand"><FaEdit /></button>
                      {u._id !== me?.id && (
                        <button onClick={() => setDeleteId(u._id)} className="btn-ghost p-2 text-accent"><FaTrash /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?._id ? 'Edit User' : 'Add User'} size="sm">
        {editing && (
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="label">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" value={form.email} disabled={!!editing._id} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="label">{editing._id ? 'New Password (leave blank to keep)' : 'Password'}</label>
              <input className="input" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing._id} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete user?" message="This account will lose access immediately." />
    </div>
  );
}
