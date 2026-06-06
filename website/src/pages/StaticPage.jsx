import SEO from '../components/SEO';
import { Loader, ErrorState } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { fetchPage } from '../services/content.service';

const contentClass =
  'prose prose-lg max-w-3xl text-ink leading-relaxed [&_p]:mb-4 [&_h2]:font-extrabold [&_h2]:text-2xl [&_h2]:mt-8 [&_h3]:font-bold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:mb-1 [&_a]:text-brand';

/**
 * Renders a CMS-managed static page (Staffing Solutions, Terms & Conditions, …)
 * fetched by slug. The content is edited entirely from the admin portal.
 */
export default function StaticPage({ slug, fallbackTitle = 'Page' }) {
  const { data: page, loading, error } = useFetch(() => fetchPage(slug), [slug]);

  return (
    <div>
      <SEO title={page?.metaTitle || page?.title || fallbackTitle} description={page?.metaDescription} />

      <section className="bg-brand-gradient text-white py-16">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">{page?.title || fallbackTitle}</h1>
        </div>
      </section>

      <section className="container-bicard py-12">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <article className={contentClass} dangerouslySetInnerHTML={{ __html: page?.content || '' }} />
        )}
      </section>
    </div>
  );
}
