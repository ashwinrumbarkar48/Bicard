import { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ImageUpload from './ImageUpload';

// Convert a stored record into editable form state.
const toFormState = (fields, record) => {
  const state = {};
  fields.forEach((f) => {
    const val = record?.[f.name];
    if (f.type === 'list') state[f.name] = Array.isArray(val) ? val.join('\n') : '';
    else if (f.type === 'tags') state[f.name] = Array.isArray(val) ? val.join(', ') : '';
    else if (f.type === 'faqs') state[f.name] = Array.isArray(val) && val.length ? val : [];
    else if (f.type === 'toggle') state[f.name] = !!val;
    else state[f.name] = val ?? '';
  });
  return state;
};

// Convert form state into an API payload.
const toPayload = (fields, state) => {
  const payload = {};
  fields.forEach((f) => {
    const val = state[f.name];
    if (f.type === 'image') {
      if (val instanceof File) payload[f.name] = val; // only send when a new file picked
    } else if (f.type === 'list') {
      payload[f.name] = String(val || '').split('\n').map((s) => s.trim()).filter(Boolean);
    } else if (f.type === 'tags') {
      payload[f.name] = String(val || '').split(',').map((s) => s.trim()).filter(Boolean);
    } else if (f.type === 'faqs') {
      payload[f.name] = (val || []).filter((q) => q.question?.trim());
    } else if (f.type === 'toggle') {
      payload[f.name] = !!val;
    } else if (f.type === 'number') {
      payload[f.name] = val === '' ? undefined : Number(val);
    } else {
      payload[f.name] = val;
    }
  });
  return payload;
};

export default function ResourceForm({ fields, record, onSubmit, onCancel, submitting }) {
  const [state, setState] = useState(() => toFormState(fields, record));

  const set = (name, value) => setState((s) => ({ ...s, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(toPayload(fields, state));
  };

  const renderField = (f) => {
    switch (f.type) {
      case 'textarea':
        return <textarea className="input" rows="3" value={state[f.name]} onChange={(e) => set(f.name, e.target.value)} />;
      case 'richtext':
        return (
          <textarea
            className="input font-mono text-xs"
            rows="6"
            placeholder="Supports HTML"
            value={state[f.name]}
            onChange={(e) => set(f.name, e.target.value)}
          />
        );
      case 'list':
        return <textarea className="input" rows="4" value={state[f.name]} onChange={(e) => set(f.name, e.target.value)} />;
      case 'tags':
        return <input className="input" value={state[f.name]} onChange={(e) => set(f.name, e.target.value)} />;
      case 'number':
        return <input type="number" step="any" className="input" value={state[f.name]} onChange={(e) => set(f.name, e.target.value)} />;
      case 'select':
        return (
          <select className="input" value={state[f.name]} onChange={(e) => set(f.name, e.target.value)}>
            <option value="">Select…</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        );
      case 'toggle':
        return (
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!state[f.name]} onChange={(e) => set(f.name, e.target.checked)} className="h-5 w-5 accent-[#00633F]" />
            <span className="text-sm text-ink-light">{state[f.name] ? 'Yes' : 'No'}</span>
          </label>
        );
      case 'image':
        return <ImageUpload current={record?.[f.name]} onChange={(file) => set(f.name, file)} />;
      case 'faqs':
        return <FaqEditor value={state[f.name] || []} onChange={(v) => set(f.name, v)} />;
      default:
        return <input className="input" value={state[f.name]} onChange={(e) => set(f.name, e.target.value)} required={f.required} />;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4">
        {fields.map((f) => (
          <div key={f.name} className={f.half ? 'col-span-2 sm:col-span-1' : 'col-span-2'}>
            <label className="label">
              {f.label} {f.required && <span className="text-accent">*</span>}
            </label>
            {renderField(f)}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
        <button type="button" onClick={onCancel} className="btn-outline">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}

function FaqEditor({ value, onChange }) {
  const update = (i, key, v) => {
    const next = value.map((q, idx) => (idx === i ? { ...q, [key]: v } : q));
    onChange(next);
  };
  const add = () => onChange([...value, { question: '', answer: '' }]);
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-3">
      {value.map((q, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <input className="input" placeholder="Question" value={q.question} onChange={(e) => update(i, 'question', e.target.value)} />
            <button type="button" onClick={() => remove(i)} className="btn-ghost text-accent px-2"><FaTrash /></button>
          </div>
          <textarea className="input" rows="2" placeholder="Answer" value={q.answer} onChange={(e) => update(i, 'answer', e.target.value)} />
        </div>
      ))}
      <button type="button" onClick={add} className="btn-outline text-sm"><FaPlus /> Add FAQ</button>
    </div>
  );
}
