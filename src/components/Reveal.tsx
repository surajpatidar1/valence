import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ElementType, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: 'div' | 'p' | 'h1' | 'h2' | 'h3' | 'li' | 'article' | 'ul' | 'span' | 'form' | 'details';
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children'>;

/** Fades and lifts content into view once, when scrolled into the viewport. */
export default function Reveal({ children, delay = 0, y = 32, as = 'div', className, ...rest }: Props) {
  const Comp = motion[as] as ElementType;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}
