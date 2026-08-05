'use client';

import React, { HTMLAttributes } from 'react';
import Link from 'next/link';

export interface DynamicCardProps extends HTMLAttributes<HTMLElement> {
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
  level?: 0 | 1 | 2 | 3 | 4;
  href?: string;
  target?: string;
  rel?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  [key: string]: any;
}

export function DynamicCard({
  interactive = true,
  selected = false,
  disabled = false,
  level = 3,
  href,
  children,
  className = '',
  onClick,
  onKeyDown,
  ...props
}: DynamicCardProps) {
  const isInteractive = interactive && !disabled;

  const baseClasses = 'dynamic-card group';
  const interactiveClasses = isInteractive ? 'dynamic-card-interactive' : '';
  const selectedClasses = selected ? 'dynamic-card-selected' : '';
  const disabledClasses = disabled ? 'dynamic-card-disabled' : '';

  const levelClasses = {
    0: 'surface-level-0',
    1: 'surface-level-1',
    2: 'surface-level-2',
    3: 'surface-level-3',
    4: 'surface-level-4',
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (onKeyDown) {
      onKeyDown(e);
    }
    if (isInteractive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e as unknown as React.MouseEvent<HTMLElement>);
    }
  };

  const combinedClassName = `${baseClasses} ${levelClasses[level]} ${interactiveClasses} ${selectedClasses} ${disabledClasses} ${className}`.trim();

  if (href && isInteractive) {
    return (
      <Link
        href={href}
        tabIndex={0}
        aria-selected={selected ? true : undefined}
        aria-disabled={disabled ? true : undefined}
        className={combinedClassName}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <div
      tabIndex={isInteractive ? 0 : undefined}
      role={isInteractive && onClick ? 'button' : undefined}
      aria-selected={selected ? true : undefined}
      aria-disabled={disabled ? true : undefined}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={handleKeyDown}
      className={combinedClassName}
      {...props}
    >
      {children}
    </div>
  );
}

export default DynamicCard;
