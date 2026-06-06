import { Link } from 'react-router-dom';
import { FaCheckCircle, FaBriefcase, FaChalkboardTeacher, FaLaptopCode, FaUserGraduate, FaArrowRight, FaPlay, FaMicrochip } from 'react-icons/fa';
import SEO from '../components/SEO';
import CourseCard from '../components/CourseCard';
import { SectionHeading, StarRating } from '../components/ui';
import { SkeletonGrid } from '../components/Spinner';
import useFetch from '../hooks/useFetch';
import useReveal from '../hooks/useReveal';
import { fetchCourses, fetchTestimonials, fetchPartners } from '../services/content.service';
import { assetUrl } from '../services/api';
import StatsBand from '../components/StatsBand';
import NasscomCallout, { NasscomBadge } from '../components/NasscomCallout';

const features = [
  { icon: FaLaptopCode, title: 'Hands-on Hardware Labs', text: 'Real microcontrollers, boards and tools — not just slides.' },
  { icon: FaChalkboardTeacher, title: 'Industry Expert Mentors', text: 'Learn from engineers with 10+ years of product experience.' },
  { icon: FaBriefcase, title: '100% Placement Support', text: 'Resume prep, mock interviews and direct hiring partner access.' },
  { icon: FaUserGraduate, title: 'Job-Guarantee Tracks', text: 'Outcome-focused programs designed to get you hired.' },
];

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

export default function Home() {
  const { data: coursesRes, loading } = useFetch(() => fetchCourses({ limit: 8 }), []);
  const { data: testimonialsRes } = useFetch(() => fetchTestimonials({ limit: 6 }), []);
  const { data: partnersRes } = useFetch(() => fetchPartners({ limit: 12 }), []);

  const courses = coursesRes?.data || [];
  const testimonials = testimonialsRes?.data || [];
  const partners = partnersRes?.data || [];

  return (
    <div>
      <SEO title="Be Job Ready in Embedded Systems" description="Embedded Systems, IoT, Automotive & Edge training in Pune since 2000, with 100% placement support." />

      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden bg-brand-gradient text-white">
        {/* decorative glow + blobs */}
        <div className="pointer-events-none absolute inset-0 bg-brand-radial" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-highlight/10 blur-3xl animate-pulse-slow" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="container-bicard relative grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
          <div className="animate-fade-up">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="badge bg-highlight text-ink shadow-lg">★ 100% Placement Support</span>
              <NasscomBadge dark />
            </div>
            <h1 className="text-4xl md:text-[3.25rem] font-extrabold leading-[1.08] text-white">
              Be Job-Ready in <span className="text-gradient">Embedded Systems</span>
            </h1>
            <p className="mt-6 text-lg text-brand-100 max-w-xl">
              Master Embedded C, IoT, Automotive and Edge systems with hands-on labs, industry-expert
              mentors and placement support — Pune's leading embedded systems institute since 2000.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link to="/courses" className="btn bg-highlight text-ink hover:bg-highlight-400 text-base px-7 py-3.5 shadow-glow">
                Explore Courses <FaArrowRight />
              </Link>
              <Link to="/contact" className="btn bg-white/10 text-white border-2 border-white/30 backdrop-blur hover:bg-white/20 text-base px-7 py-3.5">
                <FaPlay className="text-xs" /> Book Free Demo
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-9 w-9 rounded-full bg-white/20 border-2 border-deep grid place-items-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-bold text-white"><StarInline /> 4.8/5</div>
                <div className="text-brand-100 text-xs">Training since 2000</div>
              </div>
            </div>
          </div>

          {/* Hero visual with floating badge cards */}
          <div className="hidden lg:block relative animate-fade-up" style={{ animationDelay: '120ms' }}>
            <div className="relative rounded-xl2 overflow-hidden shadow-glow ring-1 ring-white/10">
              <img
                src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=70"
                alt="Embedded systems training"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-dark/60 to-transparent" />
            </div>
            <div className="absolute -left-6 top-10 bg-white text-ink rounded-2xl shadow-card-hover px-4 py-3 flex items-center gap-3 animate-float">
              <span className="icon-tile h-10 w-10 text-lg"><FaMicrochip /></span>
              <div>
                <div className="font-extrabold text-sm leading-none">Live Hardware</div>
                <div className="text-ink-light text-xs">Real lab access</div>
              </div>
            </div>
            <div className="absolute -right-4 bottom-10 bg-white text-ink rounded-2xl shadow-card-hover px-4 py-3 flex items-center gap-3 animate-float" style={{ animationDelay: '1.5s' }}>
              <span className="icon-tile h-10 w-10 text-lg bg-accent-50 text-accent"><FaBriefcase /></span>
              <div>
                <div className="font-extrabold text-sm leading-none">Placed at top firms</div>
                <div className="text-ink-light text-xs">1000+ companies</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Stats (animated, managed in admin → Settings) ---------- */}
      <section className="bg-deep text-white">
        <div className="container-bicard py-14">
          <StatsBand />
        </div>
      </section>

      {/* ---------- Featured courses ---------- */}
      <section className="container-bicard py-20">
        <Reveal>
          <SectionHeading eyebrow="Our Programs" title="A broad selection of job-ready courses" subtitle="Choose from industry-aligned programs built for placement." />
        </Reveal>
        {loading ? (
          <div className="mt-10"><SkeletonGrid count={8} /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {courses.map((c, i) => (
              <Reveal key={c._id} delay={(i % 4) * 80}>
                <CourseCard course={c} />
              </Reveal>
            ))}
          </div>
        )}
        <div className="text-center mt-12">
          <Link to="/courses" className="btn-outline">View all courses <FaArrowRight /></Link>
        </div>
      </section>

      {/* ---------- Why choose ---------- */}
      <section className="bg-mint-fade">
        <div className="container-bicard py-20">
          <Reveal><SectionHeading center eyebrow="Why BICARD" title="Learning that gets you hired" /></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="group bg-white rounded-card p-7 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center h-full">
                  <div className="icon-tile h-16 w-16 text-2xl mx-auto mb-5 group-hover:bg-brand group-hover:text-white transition-colors">
                    <f.icon />
                  </div>
                  <h3 className="font-bold text-lg">{f.title}</h3>
                  <p className="text-ink-light text-sm mt-2">{f.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- nasscom Accelerated Career Program ---------- */}
      <NasscomCallout />

      {/* ---------- Testimonials ---------- */}
      {testimonials.length > 0 && (
        <section className="container-bicard py-20">
          <Reveal><SectionHeading center eyebrow="Success Stories" title="Our students, now working at top companies" /></Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {testimonials.map((t, i) => (
              <Reveal key={t._id} delay={(i % 3) * 80}>
                <div className="relative bg-white border border-gray-200/80 rounded-card p-7 shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                  <span className="absolute top-5 right-6 text-6xl leading-none text-brand-100 font-serif select-none">”</span>
                  <StarRating value={t.rating || 5} />
                  <p className="mt-4 text-ink leading-relaxed relative">{t.testimonial}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-brand text-white grid place-items-center font-bold overflow-hidden ring-2 ring-brand-100">
                      {t.image ? <img src={assetUrl(t.image)} alt={t.studentName} className="h-full w-full object-cover" /> : t.studentName?.[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{t.studentName}</div>
                      <div className="text-ink-light text-xs">{t.course}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Partners ---------- */}
      {partners.length > 0 && (
        <section className="bg-paper border-y border-gray-100">
          <div className="container-bicard py-16">
            <Reveal><SectionHeading center title="Our Placement Partners" subtitle="Trusted by leading product and engineering companies." /></Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mt-10">
              {partners.map((p) => (
                <div key={p._id} className="text-ink-light font-bold text-lg opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition duration-300">
                  {p.logo ? <img src={assetUrl(p.logo)} alt={p.companyName} className="h-10 object-contain" /> : p.companyName}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- CTA ---------- */}
      <section className="py-20">
        <div className="container-bicard">
          <div className="relative overflow-hidden rounded-xl2 bg-brand-gradient text-white px-8 py-14 md:px-14 shadow-glow">
            <div className="pointer-events-none absolute -top-16 -right-10 h-64 w-64 rounded-full bg-highlight/15 blur-3xl" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white">Ready to start your tech career?</h2>
                <p className="mt-3 text-brand-100 flex items-center gap-2">
                  <FaCheckCircle className="text-highlight" /> Free career counselling · Limited seats per batch
                </p>
              </div>
              <Link to="/contact" className="btn bg-highlight text-ink hover:bg-highlight-400 text-base px-8 py-4 shadow-lg whitespace-nowrap">
                Talk to a Counsellor <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StarInline() {
  return <span className="text-highlight">★★★★★</span>;
}
