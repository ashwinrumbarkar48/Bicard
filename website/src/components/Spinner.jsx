/**
 * BICARD branded loading components.
 *
 * <Spinner />              inline orbital spinner with monogram
 * <Spinner label="…" />    spinner with animated label
 * <PageLoader />           centered loader for page/section bodies
 * <FullScreenLoader />     overlay loader (e.g. route transitions)
 * <SkeletonCard />         shimmer placeholder shaped like a CourseCard
 * <SkeletonGrid count />   responsive grid of skeleton cards
 */

const SIZES = {
  sm: { box: 'h-12 w-12', px: 48, text: 'text-sm' },
  md: { box: 'h-16 w-16', px: 64, text: 'text-lg' },
  lg: { box: 'h-24 w-24', px: 96, text: 'text-2xl' },
};

export function Spinner({ size = 'md', label, className = '' }) {
  const s = SIZES[size] || SIZES.md;
  const C = 2 * Math.PI * 20; // circumference of r=20 circle

  return (
    <div className={`inline-flex flex-col items-center gap-4 ${className}`}>
      <div className={`relative ${s.box}`}>
        {/* spinning gradient-arc ring */}
        <svg className="animate-spin" style={{ animationDuration: '1.1s' }} width={s.px} height={s.px} viewBox="0 0 50 50">
          <defs>
            <linearGradient id="bicard-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#047857" />
              <stop offset="70%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#FDD303" />
            </linearGradient>
          </defs>
          {/* track */}
          <circle cx="25" cy="25" r="20" fill="none" stroke="#d1fae5" strokeWidth="4" />
          {/* moving arc */}
          <circle
            cx="25" cy="25" r="20" fill="none"
            stroke="url(#bicard-ring)" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${C * 0.6} ${C}`}
          />
        </svg>
        {/* steady monogram */}
        <div className="absolute inset-0 grid place-items-center">
          <span className={`font-extrabold ${s.text} bg-gradient-to-br from-brand to-deep bg-clip-text text-transparent`}>
            B
          </span>
        </div>
      </div>

      {label && (
        <div className="flex items-center gap-1.5 text-ink-light text-sm font-medium">
          <span>{label}</span>
          <span className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-brand animate-bounce-dot"
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </span>
        </div>
      )}
    </div>
  );
}

export function PageLoader({ label = 'Loading' }) {
  return (
    <div className="flex items-center justify-center py-24">
      <Spinner size="md" label={label} />
    </div>
  );
}

export function FullScreenLoader({ label = 'Loading' }) {
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-white/80 backdrop-blur-sm">
      <Spinner size="lg" label={label} />
    </div>
  );
}

/* ---------- Skeleton placeholders ---------- */

function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200/70 ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-card border border-gray-200/80 overflow-hidden bg-white shadow-card">
      <Shimmer className="aspect-video" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-4 w-5/6 rounded" />
        <Shimmer className="h-3 w-full rounded" />
        <Shimmer className="h-3 w-2/3 rounded" />
        <div className="flex items-center justify-between pt-3">
          <Shimmer className="h-5 w-16 rounded" />
          <Shimmer className="h-3 w-10 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 8, className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6' }) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default Spinner;
