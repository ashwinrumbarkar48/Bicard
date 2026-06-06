import SEO from '../components/SEO';
import { Loader, EmptyState, ErrorState, SectionHeading } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { fetchFaculty } from '../services/content.service';
import { assetUrl } from '../services/api';

const placeholder = 'https://ui-avatars.com/api/?background=00633F&color=fff&name=';

export default function Faculty() {
  const { data, loading, error } = useFetch(() => fetchFaculty({ limit: 50 }), []);
  const faculty = data?.data || [];

  return (
    <div>
      <SEO title="Faculty" description="Meet BICARD's industry-expert trainers and mentors." />

      <section className="bg-brand-gradient text-white py-16">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Meet our faculty</h1>
          <p className="mt-2 text-brand-100">Learn from engineers with deep industry and product experience.</p>
        </div>
      </section>

      <section className="container-bicard py-12">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} />
        ) : faculty.length === 0 ? (
          <EmptyState message="Faculty profiles coming soon." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {faculty.map((f) => (
              <div key={f._id} className="bg-white border border-gray-200 rounded-card shadow-card overflow-hidden text-center">
                <img
                  src={assetUrl(f.photo, `${placeholder}${encodeURIComponent(f.name)}`)}
                  alt={f.name}
                  className="w-full h-60 object-cover bg-gray-100"
                />
                <div className="p-5">
                  <h3 className="font-bold text-lg">{f.name}</h3>
                  <p className="text-brand font-semibold text-sm">{f.designation}</p>
                  {f.qualification && <p className="text-ink-light text-xs mt-1">{f.qualification}</p>}
                  {f.experience && <p className="text-ink-light text-xs">{f.experience} experience</p>}
                  {f.description && <p className="text-ink-light text-sm mt-3">{f.description}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
