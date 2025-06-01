import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'auto';
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '100vw',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  quality = 75,
  format = 'auto'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image URLs
  const generateImageUrl = (originalSrc: string, targetWidth?: number) => {
    // If it's already a data URL or external URL, return as-is
    if (originalSrc.startsWith('data:') || originalSrc.startsWith('http')) {
      return originalSrc;
    }

    // Build query parameters for image optimization
    const params = new URLSearchParams();
    
    if (targetWidth) {
      params.append('w', targetWidth.toString());
    }
    if (quality && quality !== 75) {
      params.append('q', quality.toString());
    }
    if (format !== 'auto') {
      params.append('f', format);
    }

    const queryString = params.toString();
    return queryString ? `${originalSrc}?${queryString}` : originalSrc;
  };

  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!width) return undefined;

    const breakpoints = [640, 768, 1024, 1280, 1536];
    const srcSet = breakpoints
      .filter(bp => bp <= width * 2) // Don't generate larger than 2x the display size
      .map(bp => `${generateImageUrl(src, bp)} ${bp}w`)
      .join(', ');

    return srcSet || undefined;
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const img = imgRef.current;
    if (!img) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observerRef.current.observe(img);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const shouldShowPlaceholder = placeholder === 'blur' && !isLoaded && !hasError;

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {shouldShowPlaceholder && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-800"
          style={{
            backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
        />
      )}

      {/* Main image */}
      {(isInView || priority) && !hasError && (
        <img
          ref={imgRef}
          src={generateImageUrl(src, width)}
          srcSet={generateSrcSet()}
          sizes={sizes}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            'w-full h-full object-cover'
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <svg
              className="w-12 h-12 mx-auto mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Kép nem tölthető be</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Course thumbnail component with specific optimizations
interface CourseThumbnailProps {
  src: string;
  alt: string;
  courseId: number;
  className?: string;
  priority?: boolean;
}

export function CourseThumbnail({ 
  src, 
  alt, 
  courseId, 
  className, 
  priority = false 
}: CourseThumbnailProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={225}
      className={cn('aspect-video rounded-lg', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="225" xmlns="http://www.w3.org/2000/svg">
          <rect width="400" height="225" fill="#f3f4f6"/>
          <text x="50%" y="50%" font-family="sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dy=".3em">
            Kurzus ${courseId}
          </text>
        </svg>
      `)}`}
      quality={85}
      format="webp"
    />
  );
}

// Avatar component with optimizations
interface OptimizedAvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

export function OptimizedAvatar({ 
  src, 
  alt, 
  size = 'md', 
  className, 
  fallback 
}: OptimizedAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const sizePixels = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96
  };

  if (!src) {
    return (
      <div className={cn(
        'rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium',
        sizeClasses[size],
        className
      )}>
        {fallback || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={sizePixels[size]}
      height={sizePixels[size]}
      className={cn('rounded-full', sizeClasses[size], className)}
      sizes={`${sizePixels[size]}px`}
      quality={90}
      format="webp"
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${btoa(`
        <svg width="${sizePixels[size]}" height="${sizePixels[size]}" xmlns="http://www.w3.org/2000/svg">
          <circle cx="${sizePixels[size]/2}" cy="${sizePixels[size]/2}" r="${sizePixels[size]/2}" fill="#e5e7eb"/>
        </svg>
      `)}`}
    />
  );
}

// Hero image component for large images
interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  overlay?: boolean;
}

export function HeroImage({ src, alt, className, overlay = false }: HeroImageProps) {
  return (
    <div className={cn('relative', className)}>
      <OptimizedImage
        src={src}
        alt={alt}
        width={1920}
        height={1080}
        className="w-full h-full object-cover"
        sizes="100vw"
        priority={true}
        quality={80}
        format="webp"
        placeholder="blur"
        blurDataURL={`data:image/svg+xml;base64,${btoa(`
          <svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect width="1920" height="1080" fill="url(#grad)"/>
          </svg>
        `)}`}
      />
      
      {overlay && (
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      )}
    </div>
  );
}

// Image gallery component with lazy loading
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  className?: string;
}

export function ImageGallery({ images, className }: ImageGalleryProps) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4', className)}>
      {images.map((image, index) => (
        <div key={index} className="group cursor-pointer">
          <OptimizedImage
            src={image.src}
            alt={image.alt}
            width={300}
            height={200}
            className="aspect-[3/2] rounded-lg group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={index < 4} // Prioritize first 4 images
            quality={75}
            format="webp"
          />
          {image.caption && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {image.caption}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}