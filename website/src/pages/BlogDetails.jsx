import { useParams, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Loader, ErrorState } from '../components/ui';
import useFetch from '../hooks/useFetch';
import { fetchBlogBySlug } from '../services/content.service';
import { assetUrl } from '../services/api';

const placeholder =
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=70';

export default function BlogDetails() {
  const { slug } = useParams();
  const { data: blog, loading, error } = useFetch(() => fetchBlogBySlug(slug), [slug]);

  if (loading) return <Loader />;
  if (error || !blog) return <ErrorState message="Article not found." />;

  return (
    <div>
      <SEO title={blog.metaTitle || blog.title} description={blog.metaDescription} image={assetUrl(blog.featuredImage)} />

      <article className="container-bicard max-w-3xl py-12">
        <Link to="/blogs" className="text-brand text-sm font-semibold">← Back to blog</Link>
        {blog.category && <div className="mt-4"><span className="badge bg-brand-50 text-brand">{blog.category}</span></div>}
        <h1 className="text-3xl md:text-4xl font-extrabold mt-3 leading-tight">{blog.title}</h1>
        <p className="text-ink-light text-sm mt-3">
          {blog.createdAt && new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <img src={assetUrl(blog.featuredImage, placeholder)} alt={blog.title} className="w-full rounded-card mt-6 object-cover" />

        <div
          className="prose prose-lg max-w-none mt-8 text-ink leading-relaxed [&_p]:mb-4 [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-6 [&_a]:text-brand"
          dangerouslySetInnerHTML={{ __html: blog.content || '' }}
        />

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8">
            {blog.tags.map((t) => (
              <span key={t} className="badge bg-gray-100 text-ink-light">#{t}</span>
            ))}
          </div>
        )}
      </article>
    </div>
  );
}
