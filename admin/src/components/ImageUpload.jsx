import { useState } from 'react';
import { FaUpload } from 'react-icons/fa';
import { assetUrl } from '../services/api';

/**
 * Image picker that calls onChange with the selected File.
 * `current` is the existing stored path (when editing).
 */
export default function ImageUpload({ current, onChange }) {
  const [preview, setPreview] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  const shown = preview || (current ? assetUrl(current) : null);

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-20 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden grid place-items-center text-ink-light shrink-0">
        {shown ? <img src={shown} alt="preview" className="h-full w-full object-cover" /> : <FaUpload />}
      </div>
      <label className="btn-outline cursor-pointer">
        Choose Image
        <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </label>
    </div>
  );
}
