import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

/** Stylised nasscom wordmark (lowercase, as per the nasscom brand). */
export function NasscomMark({ className = '' }) {
  return (
    <span className={`font-extrabold lowercase tracking-tight ${className}`}>
      nasscom<sup className="text-[0.5em] align-super">®</sup>
    </span>
  );
}

/** Small "in association with nasscom" pill — used in heroes. */
export function NasscomBadge({ dark = false }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
        dark ? 'bg-white/10 text-white' : 'bg-brand/5 text-brand'
      }`}
    >
      In association with <NasscomMark />
    </span>
  );
}

/** Full callout section promoting the nasscom-powered Accelerated Career Program. */
export default function NasscomCallout() {
  return (
    <section className="container-bicard py-14">
      <div className="relative overflow-hidden rounded-xl2 border border-brand/15 bg-mint-fade px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <NasscomBadge />
          <h3 className="mt-3 text-2xl md:text-3xl font-extrabold text-ink">
            Accelerated Career Program — Powered by <NasscomMark className="text-brand" />
          </h3>
          <p className="mt-2 text-ink-light max-w-2xl">
            An intensive on-campus program launched in collaboration with nasscom to meet the specific
            hiring requirements of technology leaders — with interview opportunities at nasscom partner companies.
          </p>
        </div>
        <Link to="/training" className="btn-primary whitespace-nowrap">
          Explore the Program <FaArrowRight />
        </Link>
      </div>
    </section>
  );
}
