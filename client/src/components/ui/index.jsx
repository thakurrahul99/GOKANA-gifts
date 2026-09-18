import { Star, StarHalf, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

/* ── Rating ──────────────────────────────────────────────────── */
export function Rating({ value = 5, count, size = 'sm', className }) {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  const starSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f${i}`} size={starSize} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />
        ))}
        {half && <StarHalf size={starSize} style={{ color: 'var(--accent)', fill: 'var(--accent)' }} />}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e${i}`} size={starSize} style={{ color: 'var(--muted-2)' }} />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs font-sans ml-1" style={{ color: 'var(--muted)' }}>({count})</span>
      )}
    </div>
  );
}

/* ── Badge ───────────────────────────────────────────────────── */
export function Badge({ children, variant = 'default', className }) {
  const styles = {
    default:      { background: 'var(--primary)', color: '#FFFFFF' },
    gold:         { background: 'var(--accent-soft)', color: 'var(--primary)' },
    bestseller:   { background: 'var(--accent-soft)', color: 'var(--primary)' },
    new:          { background: 'var(--primary-soft)', color: 'var(--primary)' },
    sale:         { background: 'var(--blush)', color: 'var(--primary)' },
    limited:      { background: 'var(--blush)', color: 'var(--primary)' },
    champagne:    { background: 'var(--accent-soft)', color: 'var(--primary)' },
    personalisable: { background: 'var(--accent-soft)', color: 'var(--primary)' },
    outline:      { background: 'transparent', color: 'var(--primary)', border: '1.5px solid var(--border)' },
  };

  const style = styles[variant] || styles.default;

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 font-sans font-semibold tracking-[0.12em] uppercase',
        className
      )}
      style={{
        fontSize: '10px',
        borderRadius: '999px',
        ...style,
      }}
    >
      {children}
    </span>
  );
}

/* ── Verified Badge ──────────────────────────────────────────── */
export function VerifiedBadge({ className }) {
  return (
    <span
      className={clsx('inline-flex items-center gap-1 font-sans text-[10px] font-medium', className)}
      style={{ color: 'var(--success)' }}
    >
      <CheckCircle size={10} />
      Verified Purchase
    </span>
  );
}

/* ── Divider ─────────────────────────────────────────────────── */
export function Divider({ className }) {
  return (
    <div
      className={clsx('h-px', className)}
      style={{ width: '3rem', background: 'var(--accent)' }}
    />
  );
}

/* ── Loading Spinner ─────────────────────────────────────────── */
export function LoadingSpinner({ size = 24, color }) {
  return (
    <svg
      className="animate-spin"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ color: color || 'var(--accent)' }}
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
    </svg>
  );
}

/* ── Skeleton ────────────────────────────────────────────────── */
export function Skeleton({ className, style: extraStyle }) {
  return (
    <div
      className={clsx('skeleton rounded', className)}
      style={extraStyle}
      aria-hidden="true"
    />
  );
}

/* ── Price formatter ─────────────────────────────────────────── */
export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/* ── Delivery date estimate ──────────────────────────────────── */
export function getDeliveryDate(daysFromNow = 3) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}
