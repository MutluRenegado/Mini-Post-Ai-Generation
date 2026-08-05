import React, { HTMLAttributes } from 'react';

export interface SurfaceProps extends HTMLAttributes<HTMLDivElement> {
  level?: 0 | 1 | 2 | 3 | 4;
  glass?: boolean;
  interactive?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function Surface({
  level = 2,
  glass = false,
  interactive = false,
  children,
  className = '',
  ...props
}: SurfaceProps) {
  const levelClasses = {
    0: 'surface-level-0',
    1: 'surface-level-1 rounded-2xl',
    2: 'surface-level-2 rounded-2xl',
    3: 'surface-level-3 rounded-xl',
    4: 'surface-level-4 rounded-xl',
  };

  const glassClass = glass ? 'surface-glass' : '';
  const interactiveClass = interactive ? 'interactive-lift cursor-pointer hover:border-amber-500/40' : '';

  return (
    <div
      className={`${levelClasses[level]} ${glassClass} ${interactiveClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
