import { Link } from 'react-router-dom';
import {
  FaLaptopCode, FaBullseye, FaBriefcase, FaHandsHelping,
  FaCode, FaProjectDiagram, FaHeart, FaRocket,
} from 'react-icons/fa';
import SEO from '../components/SEO';
import { SectionHeading } from '../components/ui';
import StatsBand from '../components/StatsBand';
import NasscomCallout from '../components/NasscomCallout';
import useFetch from '../hooks/useFetch';
import { fetchPage } from '../services/content.service';

// The eight things BICARD highlights about how they teach (from bicard.org).
const factors = [
  { icon: FaLaptopCode, title: 'Learn by Doing' },
  { icon: FaBullseye, title: 'Skilled Objectives' },
  { icon: FaBriefcase, title: 'Job-Focused Content' },
  { icon: FaHandsHelping, title: 'Real Human Help' },
  { icon: FaCode, title: 'Personalized Code Reviews' },
  { icon: FaProjectDiagram, title: 'Real-Life Projects' },
  { icon: FaHeart, title: 'Compassionate Support' },
  { icon: FaRocket, title: 'Trendsetting Goals' },
];

const FALLBACK = `<p>BICARD is one of the best and leading embedded systems training institutes in Pune, offering classroom and online courses. A leading embedded systems training provider since 2000, BICARD delivers high-quality, industry-level training with real-time projects, taught by working professionals with 10–15 years of experience.</p>`;

export default function About() {
  const { data: page } = useFetch(() => fetchPage('about'), []);

  return (
    <div>
      <SEO
        title="About Us"
        description="BICARD — Pune's leading embedded systems training institute since 2000, with industry-expert trainers and placement support."
      />

      <section className="bg-brand-gradient text-white py-20">
        <div className="container-bicard">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">About BICARD</h1>
          <p className="mt-3 text-brand-100 max-w-2xl text-lg">
            A leading embedded systems training institute in Pune since 2000 — industry-level training,
            real-time projects and placement support.
          </p>
        </div>
      </section>

      {/* Who we are — narrative managed in admin → Pages ("About BICARD") */}
      <section className="container-bicard py-16 grid lg:grid-cols-2 gap-12 items-center">
        <img
          src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=70"
          alt="BICARD classroom"
          className="rounded-card shadow-card w-full object-cover"
        />
        <div>
          <SectionHeading eyebrow="Who we are" title="Industry-focused, placement-driven training" />
          <div
            className="prose max-w-none text-ink-light mt-4 leading-relaxed [&_p]:mb-4"
            dangerouslySetInnerHTML={{ __html: page?.content || FALLBACK }}
          />
          <Link to="/courses" className="btn-primary mt-6">Explore our courses</Link>
        </div>
      </section>

      {/* Animated analytics */}
      <section className="bg-paper">
        <div className="container-bicard py-16">
          <StatsBand light />
        </div>
      </section>

      {/* Why BICARD — the eight key factors */}
      <section className="container-bicard py-16">
        <SectionHeading center eyebrow="Why BICARD" title="What makes our training different" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {factors.map((f) => (
            <div key={f.title} className="bg-white rounded-card p-6 shadow-card text-center hover:shadow-card-hover hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 grid place-items-center rounded-full bg-brand/5 text-brand text-xl mx-auto mb-4">
                <f.icon />
              </div>
              <h3 className="font-bold text-sm">{f.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* nasscom association */}
      <NasscomCallout />
    </div>
  );
}
