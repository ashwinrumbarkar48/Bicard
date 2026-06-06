import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import SEO from '../components/SEO';
import CourseCard from '../components/CourseCard';
import { EmptyState, ErrorState } from '../components/ui';
import { SkeletonGrid } from '../components/Spinner';
import useFetch from '../hooks/useFetch';
import { fetchCourses } from '../services/content.service';

export default function Training() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, error } = useFetch(
    () => fetchCourses({ search: query, page, limit: 12, category: 'Training' }),
    [query, page]
  );

  const programs = data?.data || [];
  const pagination = data?.pagination;

  const onSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQuery(search.trim());
  };

  return (
    <div>
      <SEO
        title="Training Programs"
        description="BICARD's flagship Embedded Systems training programs — PG Diploma, Masters, IoT, Automotive Embedded and the nasscom Accelerated Career Program, with placement support."
      />

      <section className="bg-brand-gradient text-white py-16">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">Training Programs</h1>
          <p className="mt-2 text-brand-100">
            Long-format diploma and career programs with hands-on labs and 100% placement assistance.
          </p>
          <form onSubmit={onSearch} className="mt-6 max-w-xl flex">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a program…"
              className="flex-1 rounded-l px-4 py-3 text-ink focus:outline-none"
            />
            <button type="submit" className="bg-ink hover:bg-black px-5 rounded-r text-white" aria-label="Search">
              <FaSearch />
            </button>
          </form>
        </div>
      </section>

      <section className="container-bicard py-12">
        {loading ? (
          <SkeletonGrid count={8} />
        ) : error ? (
          <ErrorState message={error} />
        ) : programs.length === 0 ? (
          <EmptyState message="No training programs found. Try a different search." />
        ) : (
          <>
            <p className="text-ink-light text-sm mb-6">{pagination?.total} program(s) found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {programs.map((c) => (
                <CourseCard key={c._id} course={c} />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  className="btn-outline px-4 py-2 disabled:opacity-40"
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </button>
                <span className="text-sm text-ink-light px-3">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <button
                  className="btn-outline px-4 py-2 disabled:opacity-40"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
