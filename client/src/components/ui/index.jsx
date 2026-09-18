import { Star, StarHalf } from 'lucide-react';
import clsx from 'clsx';

export function Rating({ value = 5, count, size = 'sm', className }) {
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  const starSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star
            key={`f${i}`}
            size={starSize}
            className="text-gold fill-gold"
          />
        ))}
        {half && (
          <StarHalf size={starSize} className="text-gold fill-gold" />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star
            key={`e${i}`}
            size={starSize}
            className="text-charcoal/20"
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-charcoal/50 font-sans ml-1">({count})</span>
      )}
    </div>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variants = {
    default: 'bg-charcoal text-ivory',
    gold: 'bg-gold text-ivory',
    champagne: 'bg-champagne text-charcoal',
    outline: 'border border-charcoal/30 text-charcoal',
    new: 'bg-accent text-ivory',
    sale: 'bg-red-700 text-ivory',
  };

  return (
    <span
      className={clsx(
        'inline-block px-2.5 py-1 text-[10px] font-sans font-semibold tracking-[0.12em] uppercase',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Divider({ className }) {
  return <div className={clsx('w-12 h-px bg-gold', className)} />;
}

export function LoadingSpinner({ size = 24 }) {
  return (
    <svg
      className="animate-spin text-gold"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
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
        'bg-beige animate-pulse',
        className
      )}
      style={{
        background:
          'linear-gradient(90deg, #e8dfd0 25%, #f5f1eb 50%, #e8dfd0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s linear infinite',
      }}
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
