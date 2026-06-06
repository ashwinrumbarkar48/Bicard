import { useState } from 'react';
import SEO from '../components/SEO';
import BlogCard from '../components/BlogCard';
import { EmptyState, ErrorState } from '../components/ui';
import { SkeletonGrid } from '../components/Spinner';
import useFetch from '../hooks/useFetch';
import { fetchBlogs } from '../services/content.service';

export default function Blogs() {
  const [page, setPage] = useState(1);
  const { data, loading, error } = useFetch(() => fetchBlogs({ page, limit: 9 }), [page]);
  const blogs = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <SEO title="Blog" description="Career advice, tutorials and industry insights from BICARD." />

      <section className="bg-brand-gradient text-white py-16">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">BICARD Blog</h1>
          <p className="mt-2 text-brand-100">Career advice, tutorials and embedded industry insights.</p>
        </div>
      </section>

      <section className="container-bicard py-12">
        {loading ? (
          <SkeletonGrid count={9} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" />
        ) : error ? (
          <ErrorState message={error} />
        ) : blogs.length === 0 ? (
          <EmptyState message="No articles published yet." />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((b) => (
                <BlogCard key={b._id} blog={b} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button className="btn-outline px-4 py-2 disabled:opacity-40" disabled={!pagination.hasPrevPage} onClick={() => setPage((p) => p - 1)}>Prev</button>
                <span className="text-sm text-ink-light px-3">Page {pagination.page} of {pagination.totalPages}</span>
                <button className="btn-outline px-4 py-2 disabled:opacity-40" disabled={!pagination.hasNextPage} onClick={() => setPage((p) => p + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
