import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { PageHeader, Loading } from '../components/ui';
import ImageUpload from '../components/ImageUpload';

const socialFields = ['facebook', 'instagram', 'youtube', 'linkedin', 'twitter'];

export default function Settings() {
  const [data, setData] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [faviconFile, setFaviconFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((res) => setData({ socialLinks: {}, stats: [], ...res.data.data }))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));
  const setSocial = (key, val) => setData((d) => ({ ...d, socialLinks: { ...d.socialLinks, [key]: val } }));
  const setStat = (i, key, val) =>
    setData((d) => ({ ...d, stats: d.stats.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)) }));
  const addStat = () => setData((d) => ({ ...d, stats: [...(d.stats || []), { value: '', suffix: '+', label: '' }] }));
  const removeStat = (i) => setData((d) => ({ ...d, stats: d.stats.filter((_, idx) => idx !== i) }));

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      ['contactNumber', 'whatsappNumber', 'email', 'address'].forEach((k) => fd.append(k, data[k] || ''));
      fd.append('socialLinks', JSON.stringify(data.socialLinks || {}));
      fd.append('stats', JSON.stringify((data.stats || []).filter((s) => s.label)));
      if (logoFile) fd.append('logo', logoFile);
      if (faviconFile) fd.append('favicon', faviconFile);
      const res = await api.put('/settings', fd);
      setData({ socialLinks: {}, ...res.data.data });
      setLogoFile(null);
      setFaviconFile(null);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-3xl">
      <PageHeader title="Website Settings" subtitle="Contact details, branding and social links" />

      <form onSubmit={save} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h3 className="font-extrabold">Branding</h3>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="label">Logo</label>
              <ImageUpload current={data.logo} onChange={setLogoFile} />
            </div>
            <div>
              <label className="label">Favicon</label>
              <ImageUpload current={data.favicon} onChange={setFaviconFile} />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-extrabold">Contact Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Contact Number</label>
              <input className="input" value={data.contactNumber || ''} onChange={(e) => set('contactNumber', e.target.value)} />
            </div>
            <div>
              <label className="label">WhatsApp Number</label>
              <input className="input" placeholder="+91 7276606655" value={data.whatsappNumber || ''} onChange={(e) => set('whatsappNumber', e.target.value)} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" value={data.email || ''} onChange={(e) => set('email', e.target.value)} />
            </div>
          </div>
          <div>
            <label className="label">Address</label>
            <textarea className="input" rows="2" value={data.address || ''} onChange={(e) => set('address', e.target.value)} />
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold">Homepage Stats (animated counters)</h3>
            <button type="button" onClick={addStat} className="btn-outline text-sm">+ Add stat</button>
          </div>
          <p className="text-sm text-ink-light">Shown on the Home and About pages. Value = number to count up to; Suffix = e.g. “+” or “%”.</p>
          <div className="space-y-3">
            {(data.stats || []).map((s, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input className="input col-span-3" type="number" placeholder="Value" value={s.value ?? ''} onChange={(e) => setStat(i, 'value', e.target.value)} />
                <input className="input col-span-2" placeholder="Suffix" value={s.suffix || ''} onChange={(e) => setStat(i, 'suffix', e.target.value)} />
                <input className="input col-span-6" placeholder="Label (e.g. Years of Training)" value={s.label || ''} onChange={(e) => setStat(i, 'label', e.target.value)} />
                <button type="button" onClick={() => removeStat(i)} className="col-span-1 text-accent font-bold">✕</button>
              </div>
            ))}
            {(!data.stats || data.stats.length === 0) && (
              <p className="text-sm text-ink-light italic">No stats yet — click “Add stat”.</p>
            )}
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h3 className="font-extrabold">Social Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {socialFields.map((s) => (
              <div key={s}>
                <label className="label capitalize">{s}</label>
                <input className="input" placeholder={`https://${s}.com/…`} value={data.socialLinks?.[s] || ''} onChange={(e) => setSocial(s, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
