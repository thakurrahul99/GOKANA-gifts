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
            className="fill-[#D4AF37] text-[#D4AF37]"
          />
        ))}
        {half && (
          <StarHalf size={starSize} className="fill-[#D4AF37] text-[#D4AF37]" />
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star
            key={`e${i}`}
            size={starSize}
            className="text-[#E8DFD3]"
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-[#6B6B6B] font-sans ml-0.5">({count})</span>
      )}
    </div>
  );
}

export function Badge({ children, variant = 'default', className }) {
  const variantStyles = {
    default: 'bg-[#0B1F3A] text-white',
    gold: 'bg-[#F5E9C8] text-[#0B1F3A] border border-[#D4AF37]/30',
    bestseller: 'bg-[#F5E9C8] text-[#0B1F3A] border border-[#D4AF37]/30',
    new: 'bg-[#E7ECF3] text-[#0B1F3A]',
    sale: 'bg-[#F3D9D4] text-[#0B1F3A]',
    limited: 'bg-[#F3D9D4] text-[#0B1F3A]',
    champagne: 'bg-[#F5E9C8] text-[#0B1F3A]',
    personalisable: 'bg-[#F5E9C8] text-[#0B1F3A] border border-[#D4AF37]/30',
    outline: 'border border-[#0B1F3A] text-[#0B1F3A] bg-transparent',
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
  return <div className={clsx('w-12 h-px bg-[#D4AF37]', className)} role="separator" />;
}

export function LoadingSpinner({ size = 24, className }) {
  return (
    <svg
      className={clsx('animate-spin text-[#D4AF37]', className)}
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
        background: 'linear-gradient(90deg, #E8DFD3 25%, #FBF8F2 50%, #E8DFD3 75%)',
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
