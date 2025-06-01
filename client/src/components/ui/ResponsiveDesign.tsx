import React from 'react';
import { cn } from '@/lib/utils';

// Responsive container with proper breakpoints
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function ResponsiveContainer({ 
  children, 
  className = '', 
  maxWidth = 'xl',
  padding = 'md'
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md', 
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 sm:px-6',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  };

  return (
    <div className={cn(
      'mx-auto w-full',
      maxWidthClasses[maxWidth],
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}

// Responsive grid system
interface ResponsiveGridProps {
  children: React.ReactNode;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveGrid({ 
  children, 
  cols = { default: 1, md: 2, lg: 3 },
  gap = 'md',
  className = ''
}: ResponsiveGridProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  };

  const gridClasses = [
    'grid',
    gapClasses[gap]
  ];

  if (cols.default) gridClasses.push(`grid-cols-${cols.default}`);
  if (cols.sm) gridClasses.push(`sm:grid-cols-${cols.sm}`);
  if (cols.md) gridClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) gridClasses.push(`lg:grid-cols-${cols.lg}`);
  if (cols.xl) gridClasses.push(`xl:grid-cols-${cols.xl}`);

  return (
    <div className={cn(gridClasses.join(' '), className)}>
      {children}
    </div>
  );
}

// Mobile-first navigation
interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function MobileNav({ isOpen, onClose, children }: MobileNavProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Navigation panel */}
      <nav
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Mobile navigation"
      >
        {children}
      </nav>
    </>
  );
}

// Responsive text sizing
interface ResponsiveTextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
}

export function ResponsiveText({ children, variant = 'body', className = '' }: ResponsiveTextProps) {
  const variants = {
    h1: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
    h2: 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold',
    h3: 'text-lg sm:text-xl md:text-2xl font-medium',
    body: 'text-sm sm:text-base',
    caption: 'text-xs sm:text-sm text-muted-foreground'
  };

  const Component = variant.startsWith('h') ? variant as keyof JSX.IntrinsicElements : 'p';

  return (
    <Component className={cn(variants[variant], className)}>
      {children}
    </Component>
  );
}

// Responsive card layout
interface ResponsiveCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
}

export function ResponsiveCard({ children, variant = 'default', className = '' }: ResponsiveCardProps) {
  const variants = {
    default: 'p-4 sm:p-6 rounded-lg border bg-card',
    compact: 'p-3 sm:p-4 rounded border bg-card',
    featured: 'p-6 sm:p-8 md:p-10 rounded-xl border bg-card shadow-lg'
  };

  return (
    <div className={cn(variants[variant], className)}>
      {children}
    </div>
  );
}

// Responsive spacing utility
interface ResponsiveSpaceProps {
  children: React.ReactNode;
  y?: 'sm' | 'md' | 'lg' | 'xl';
  x?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ResponsiveSpace({ children, y, x, className = '' }: ResponsiveSpaceProps) {
  const ySpacing = {
    sm: 'space-y-2 sm:space-y-3',
    md: 'space-y-4 sm:space-y-6',
    lg: 'space-y-6 sm:space-y-8 md:space-y-10',
    xl: 'space-y-8 sm:space-y-12 md:space-y-16'
  };

  const xSpacing = {
    sm: 'space-x-2 sm:space-x-3',
    md: 'space-x-4 sm:space-x-6',
    lg: 'space-x-6 sm:space-x-8 md:space-x-10',
    xl: 'space-x-8 sm:space-x-12 md:space-x-16'
  };

  const spacingClasses = [
    y && ySpacing[y],
    x && xSpacing[x]
  ].filter(Boolean).join(' ');

  return (
    <div className={cn(spacingClasses, className)}>
      {children}
    </div>
  );
}

// Responsive image component
interface ResponsiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape';
  sizes?: string;
  className?: string;
  priority?: boolean;
}

export function ResponsiveImage({ 
  src, 
  alt, 
  aspectRatio = 'landscape',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  className = '',
  priority = false
}: ResponsiveImageProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]'
  };

  return (
    <div className={cn('relative overflow-hidden rounded-lg', aspectRatioClasses[aspectRatio], className)}>
      <img
        src={src}
        alt={alt}
        sizes={sizes}
        className="absolute inset-0 h-full w-full object-cover"
        loading={priority ? 'eager' : 'lazy'}
      />
    </div>
  );
}

// Responsive flex utilities
interface ResponsiveFlexProps {
  children: React.ReactNode;
  direction?: {
    default?: 'row' | 'col';
    sm?: 'row' | 'col';
    md?: 'row' | 'col';
    lg?: 'row' | 'col';
  };
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResponsiveFlex({ 
  children, 
  direction = { default: 'row' },
  align = 'center',
  justify = 'start',
  gap = 'md',
  className = ''
}: ResponsiveFlexProps) {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around'
  };

  const flexClasses = [
    'flex',
    gapClasses[gap],
    alignClasses[align],
    justifyClasses[justify]
  ];

  if (direction.default) {
    flexClasses.push(direction.default === 'row' ? 'flex-row' : 'flex-col');
  }
  if (direction.sm) {
    flexClasses.push(direction.sm === 'row' ? 'sm:flex-row' : 'sm:flex-col');
  }
  if (direction.md) {
    flexClasses.push(direction.md === 'row' ? 'md:flex-row' : 'md:flex-col');
  }
  if (direction.lg) {
    flexClasses.push(direction.lg === 'row' ? 'lg:flex-row' : 'lg:flex-col');
  }

  return (
    <div className={cn(flexClasses.join(' '), className)}>
      {children}
    </div>
  );
}