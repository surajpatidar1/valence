import type { ReactNode } from 'react';
import { useMagnetic } from '../hooks/useMagnetic';

type Variant = 'primary' | 'ghost' | 'gold';

export default function MagneticButton({
  href,
  children,
  variant = 'primary',
  size,
  className = '',
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: 'sm';
  className?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>();
  return (
    <a ref={ref} href={href} className={`btn btn--${variant}${size ? ' btn--sm' : ''} ${className}`}>
      {children}
    </a>
  );
}
