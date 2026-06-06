import { useSelector } from 'react-redux';
import { useCountUp } from '../hooks/useReveal';

// Fallback used only if admin → Settings has no stats configured.
const DEFAULT_STATS = [
  { value: 25, suffix: '+', label: 'Years of Training' },
  { value: 1000, suffix: '+', label: 'Hiring Companies' },
  { value: 100, suffix: '%', label: 'Placement Support' },
  { value: 15, suffix: '+', label: 'Yrs Trainer Experience' },
];

function StatItem({ value, suffix, label, light }) {
  const [ref, n] = useCountUp(Number(value) || 0);
  return (
    <div ref={ref} className="text-center">
      <div className={`text-3xl md:text-5xl font-extrabold tracking-tight ${light ? 'text-brand' : 'text-highlight'}`}>
        {n.toLocaleString('en-IN')}
        {suffix}
      </div>
      <div className={`text-sm md:text-base mt-1.5 font-medium ${light ? 'text-ink-light' : 'text-brand-100'}`}>
        {label}
      </div>
    </div>
  );
}

/**
 * Animated count-up "analytics" band. Reads stats from admin → Settings,
 * falling back to sensible defaults. `light` switches to dark-on-light colours.
 */
export default function StatsBand({ light = false }) {
  const settings = useSelector((s) => s.settings.data);
  const stats = settings?.stats?.length ? settings.stats : DEFAULT_STATS;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
      {stats.map((s, i) => (
        <StatItem key={`${s.label}-${i}`} {...s} light={light} />
      ))}
    </div>
  );
}
