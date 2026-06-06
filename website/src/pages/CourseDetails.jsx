import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaRegClock, FaRupeeSign, FaCheck, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import SEO from '../components/SEO';
import { Loader, ErrorState, StarRating } from '../components/ui';
import InquiryForm from '../components/InquiryForm';
import useFetch from '../hooks/useFetch';
import { fetchCourseBySlug } from '../services/content.service';
import { assetUrl } from '../services/api';

const heroPlaceholder =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=70';

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded">
      <button
        className="w-full flex items-center justify-between p-4 text-left font-semibold"
        onClick={() => setOpen((v) => !v)}
      >
        {faq.question}
        {open ? <FaChevronUp className="text-ink-light" /> : <FaChevronDown className="text-ink-light" />}
      </button>
      {open && <p className="px-4 pb-4 text-ink-light">{faq.answer}</p>}
    </div>
  );
}

export default function CourseDetails() {
  const { slug } = useParams();
  const { data: course, loading, error } = useFetch(() => fetchCourseBySlug(slug), [slug]);

  if (loading) return <Loader />;
  if (error || !course) return <ErrorState message="Course not found." />;

  return (
    <div>
      <SEO
        title={course.metaTitle || course.title}
        description={course.metaDescription || course.shortDescription}
      />

      {/* Dark hero (Udemy style) */}
      <section className="bg-ink text-white">
        <div className="container-bicard grid lg:grid-cols-3 gap-10 py-12">
          <div className="lg:col-span-2">
            <Link to="/courses" className="text-highlight text-sm font-semibold">← Back to courses</Link>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-3">{course.title}</h1>
            <p className="mt-3 text-lg text-gray-300">{course.shortDescription}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              <StarRating value={course.rating || 4.7} count={course.ratingCount || '1,200'} />
              {course.duration && (
                <span className="flex items-center gap-1 text-gray-300"><FaRegClock /> {course.duration}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="container-bicard grid lg:grid-cols-3 gap-10 py-12">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-10">
          {course.description && (
            <section>
              <h2 className="text-2xl font-extrabold mb-3">About this course</h2>
              <p className="text-ink-light leading-relaxed whitespace-pre-line">{course.description}</p>
            </section>
          )}

          {course.benefits?.length > 0 && (
            <section className="bg-paper rounded-card p-6">
              <h2 className="text-xl font-extrabold mb-4">What you'll get</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {course.benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-2 text-ink">
                    <FaCheck className="text-brand mt-1 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.curriculum?.length > 0 && (
            <section>
              <h2 className="text-2xl font-extrabold mb-4">Curriculum</h2>
              <ol className="space-y-2">
                {course.curriculum.map((c, i) => (
                  <li key={i} className="flex items-center gap-3 border border-gray-200 rounded p-3">
                    <span className="h-7 w-7 grid place-items-center rounded-full bg-brand text-white text-sm font-bold shrink-0">
                      {i + 1}
                    </span>
                    {c}
                  </li>
                ))}
              </ol>
            </section>
          )}

          {course.faqs?.length > 0 && (
            <section>
              <h2 className="text-2xl font-extrabold mb-4">Frequently asked questions</h2>
              <div className="space-y-3">
                {course.faqs.map((f, i) => (
                  <FaqItem key={i} faq={f} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky enrol card */}
        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 border border-gray-200 rounded-card shadow-card overflow-hidden bg-white">
            <img src={assetUrl(course.image, heroPlaceholder)} alt={course.title} className="w-full aspect-video object-cover" />
            <div className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-extrabold flex items-center">
                  {course.fees?.includes('₹') ? course.fees : <><FaRupeeSign className="text-2xl" />{course.fees}</>}
                </span>
              </div>
              <h3 className="font-bold mb-3">Enquire about this course</h3>
              <InquiryForm courseTitle={course.title} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
