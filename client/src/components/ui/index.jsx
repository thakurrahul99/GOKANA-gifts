import { Star, StarHalf } from 'lucide-react';
import clsx from 'clsx';

export function Rating({ value = 5, count, size = 'sm', className }) {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const empty = Math.max(0, 5 - full - (half ? 1 : 0));

  const starSize = size === 'sm' ? 14 : size === 'md' ? 16 : 18;

  return (
    <div className={clsx('flex items-center gap-1.5', className)} aria-label={`Rating: ${value} out of 5 stars`}>
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: full }).map((_, i) => (
          <Star
            key={`f${i}`}
            size={starSize}
            className="fill-accent text-accent"
          />
        ))}
        {half && (
          <StarHalf size={starSize} className="fill-accent text-accent" />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star
            key={`e${i}`}
            size={starSize}
            className="text-border"
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted font-sans ml-0.5">({count})</span>
      )}
    </div>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variantStyles = {
    default: 'bg-surface-alt text-ivory border border-[rgba(197,160,89,0.3)]',
    gold: 'bg-[rgba(197,160,89,0.18)] text-accent-light border border-[rgba(197,160,89,0.45)]',
    bestseller: 'bg-[rgba(197,160,89,0.18)] text-accent-light border border-[rgba(197,160,89,0.45)]',
    new: 'bg-surface-alt text-accent border border-[rgba(197,160,89,0.3)]',
    sale: 'bg-[#2D1B18] text-[#F3A59B] border border-[#8C3B32]/40',
    limited: 'bg-[#2D1B18] text-[#F3A59B] border border-[#8C3B32]/40',
    champagne: 'bg-[rgba(197,160,89,0.2)] text-accent-light border border-[rgba(197,160,89,0.4)]',
    personalisable: 'bg-[rgba(197,160,89,0.15)] text-accent border border-[rgba(197,160,89,0.35)]',
    outline: 'border border-[rgba(197,160,89,0.4)] text-accent bg-transparent',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-1 text-[12px] font-sans font-semibold tracking-[0.08em] uppercase rounded-full leading-none',
        variantStyles[variant] || variantStyles.default,
        className
      )}
    >
      {children}
    </span>
  );
}

export function Divider({ className }) {
  return <div className={clsx('w-12 h-px bg-accent', className)} role="separator" />;
}

export function LoadingSpinner({ size = 24, className }) {
  return (
    <svg
      className={clsx('animate-spin text-accent', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label="Loading"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"
      />
    </svg>
  );
}

export function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        'rounded animate-pulse',
        className
      )}
      style={{
        background: 'linear-gradient(90deg, var(--border) 25%, var(--surface-alt) 50%, var(--border) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s linear infinite',
      }}
      aria-hidden="true"
    />
  );
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDeliveryDate(daysAhead = 3) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}
