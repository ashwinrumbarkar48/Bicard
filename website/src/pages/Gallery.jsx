import { useState } from 'react';
import SEO from '../components/SEO';
import { Loader, EmptyState, ErrorState } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { fetchGallery } from '../services/content.service';
import { assetUrl } from '../services/api';

export default function Gallery() {
  const { data, loading, error } = useFetch(() => fetchGallery({ limit: 60 }), []);
  const items = data?.data || [];
  const [active, setActive] = useState(null);

  return (
    <div>
      <SEO title="Gallery" description="Campus life, labs and events at BICARD." />

      <section className="bg-brand-gradient text-white py-16">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Gallery</h1>
          <p className="mt-2 text-brand-100">A glimpse of our labs, classrooms and student life.</p>
        </div>
      </section>

      <section className="container-bicard py-12">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} />
        ) : items.length === 0 ? (
          <EmptyState message="Gallery photos coming soon." />
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
            {items.map((item) => (
              <button
                key={item._id}
                onClick={() => setActive(item)}
                className="block w-full overflow-hidden rounded-card group"
              >
                <img
                  src={assetUrl(item.image)}
                  alt={item.title || 'Gallery'}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="max-w-4xl w-full text-center" onClick={(e) => e.stopPropagation()}>
            <img src={assetUrl(active.image)} alt={active.title} className="max-h-[80vh] mx-auto rounded" />
            {active.title && <p className="text-white mt-3 font-semibold">{active.title}</p>}
            <button onClick={() => setActive(null)} className="btn bg-white text-ink mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
