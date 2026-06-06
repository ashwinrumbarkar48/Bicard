import SEO from '../components/SEO';
import { Loader, SectionHeading, StarRating } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { fetchPage, fetchPartners, fetchTestimonials } from '../services/content.service';

const contentClass =
  'prose prose-lg max-w-3xl text-ink leading-relaxed [&_p]:mb-4 [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1';

export default function Placements() {
  const { data: page, loading } = useFetch(() => fetchPage('placements'), []);
  const { data: partnersRes } = useFetch(() => fetchPartners({ limit: 100 }), []);
  const { data: testimonialsRes } = useFetch(() => fetchTestimonials({ limit: 12 }), []);

  const partners = partnersRes?.data || [];
  const testimonials = testimonialsRes?.data || [];

  return (
    <div>
      <SEO
        title={page?.metaTitle || 'Placements'}
        description={page?.metaDescription || 'BICARD placement assistance and our recruiting companies.'}
      />

      <section className="bg-brand-gradient text-white py-16">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{page?.title || 'Placements'}</h1>
          <p className="mt-2 text-brand-100">Industry-ready training with placement assistance across 1000+ companies.</p>
        </div>
      </section>

      <section className="container-bicard py-12">
        {loading ? (
          <Loader />
        ) : (
          <article className={contentClass} dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
        )}
      </section>

      {partners.length > 0 && (
        <section className="bg-paper py-14">
          <div className="container-bicard">
            <SectionHeading eyebrow="Our Recruiters" title="Companies that hire from BICARD" center />
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {partners.map((p) => (
                <div
                  key={p._id}
                  className="bg-white border border-gray-100 rounded-xl shadow-card px-4 py-5 text-center font-semibold text-ink hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  {p.companyName}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="container-bicard py-14">
          <SectionHeading eyebrow="Success Stories" title="What our students say" center />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t._id} className="bg-white border border-gray-100 rounded-card shadow-card p-6">
                {t.rating ? <StarRating value={t.rating} /> : null}
                <p className="text-ink-light mt-3 leading-relaxed">“{t.testimonial}”</p>
                <div className="mt-4 font-bold text-ink">{t.studentName}</div>
                {t.course && <div className="text-sm text-ink-light">{t.course}</div>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
