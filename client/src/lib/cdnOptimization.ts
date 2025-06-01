// CDN and asset optimization for the Elira platform

// CDN configuration for different environments
export const cdnConfig = {
  development: {
    enabled: false,
    baseUrl: '',
    imageOptimization: false
  },
  production: {
    enabled: true,
    baseUrl: 'https://cdn.elira.hu',
    imageOptimization: true,
    regions: ['eu-central-1', 'us-east-1'] // Primary and fallback regions
  }
};

// Asset optimization utilities
export class AssetOptimizer {
  private static baseUrl = process.env.NODE_ENV === 'production' 
    ? cdnConfig.production.baseUrl 
    : '';

  // Optimize image URLs with CDN parameters
  static optimizeImageUrl(src: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png' | 'auto';
    fit?: 'cover' | 'contain' | 'fill';
  } = {}): string {
    if (!cdnConfig[process.env.NODE_ENV as keyof typeof cdnConfig]?.enabled) {
      return src;
    }

    // Don't optimize external URLs or data URLs
    if (src.startsWith('http') || src.startsWith('data:')) {
      return src;
    }

    const params = new URLSearchParams();
    
    if (options.width) params.append('w', options.width.toString());
    if (options.height) params.append('h', options.height.toString());
    if (options.quality) params.append('q', options.quality.toString());
    if (options.format && options.format !== 'auto') params.append('f', options.format);
    if (options.fit) params.append('fit', options.fit);

    const optimizedSrc = src.startsWith('/') ? src : `/${src}`;
    const queryString = params.toString();
    
    return `${this.baseUrl}${optimizedSrc}${queryString ? `?${queryString}` : ''}`;
  }

  // Generate responsive image srcSet
  static generateSrcSet(src: string, breakpoints: number[] = [640, 768, 1024, 1280, 1536]): string {
    if (!cdnConfig[process.env.NODE_ENV as keyof typeof cdnConfig]?.imageOptimization) {
      return '';
    }

    return breakpoints
      .map(width => `${this.optimizeImageUrl(src, { width, format: 'webp' })} ${width}w`)
      .join(', ');
  }

  // Preload critical assets
  static preloadCriticalAssets() {
    const criticalAssets = [
      { href: this.optimizeImageUrl('/images/elira-logo.png', { width: 200, format: 'webp' }), as: 'image' },
      { href: this.optimizeImageUrl('/images/hero-background.jpg', { width: 1920, format: 'webp' }), as: 'image' },
      { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
    ];

    criticalAssets.forEach(asset => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = asset.href;
      link.as = asset.as as string;
      if (asset.type) link.type = asset.type;
      if (asset.crossorigin) link.crossOrigin = asset.crossorigin;
      document.head.appendChild(link);
    });
  }

  // Preconnect to external domains
  static preconnectExternalDomains() {
    const externalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://api.elira.hu',
    ];

    if (process.env.NODE_ENV === 'production') {
      externalDomains.push(cdnConfig.production.baseUrl);
    }

    externalDomains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
}

// Resource hints for performance
export class ResourceHints {
  // DNS prefetch for domains that will be used later
  static dnsPrefetch(domains: string[]) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }

  // Preload critical resources
  static preloadResource(href: string, as: string, type?: string) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (type) link.type = type;
    document.head.appendChild(link);
  }

  // Prefetch resources for next navigation
  static prefetchResource(href: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  }

  // Module preload for JS modules
  static modulePreload(href: string) {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = href;
    document.head.appendChild(link);
  }
}

// Service Worker for caching strategies
export class ServiceWorkerManager {
  static async register() {
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                this.notifyUpdate();
              }
            });
          }
        });
        
        return registration;
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  private static notifyUpdate() {
    // Notify user about available update
    if (confirm('Új verzió érhető el. Szeretné frissíteni az oldalt?')) {
      window.location.reload();
    }
  }

  static async updateCaches() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'UPDATE_CACHES' });
    }
  }
}

// Performance monitoring
export class PerformanceMonitor {
  static measureWebVitals() {
    // Measure Core Web Vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(this.sendToAnalytics);
      getFID(this.sendToAnalytics);
      getFCP(this.sendToAnalytics);
      getLCP(this.sendToAnalytics);
      getTTFB(this.sendToAnalytics);
    }).catch(() => {
      // Silently handle import error
    });
  }

  private static sendToAnalytics(metric: any) {
    // Send to analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example: gtag('event', metric.name, { value: metric.value });
      console.log('Performance metric:', metric.name, metric.value);
    }
  }

  static measureResourceTiming() {
    // Measure resource loading performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 1000) {
          console.warn('Slow resource:', entry.name, `${entry.duration}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });
  }
}

// Lazy loading utilities
export class LazyLoader {
  // Lazy load images with Intersection Observer
  static observeImages() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.dataset.src;
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Lazy load components based on scroll position
  static observeComponents(selector: string, callback: (element: Element) => void) {
    const componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target);
          componentObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.1
    });

    document.querySelectorAll(selector).forEach(element => {
      componentObserver.observe(element);
    });
  }
}

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  // Preconnect to external domains
  AssetOptimizer.preconnectExternalDomains();
  
  // DNS prefetch for likely domains
  ResourceHints.dnsPrefetch([
    'https://fonts.googleapis.com',
    'https://api.elira.hu'
  ]);

  // Register service worker
  ServiceWorkerManager.register();

  // Start performance monitoring
  PerformanceMonitor.measureWebVitals();
  PerformanceMonitor.measureResourceTiming();

  // Initialize lazy loading
  document.addEventListener('DOMContentLoaded', () => {
    LazyLoader.observeImages();
  });
}