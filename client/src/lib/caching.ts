// Advanced caching strategies for the Elira platform

// React Query cache configuration with intelligent stale times
export const cacheConfig = {
  // User data - moderate stale time, user info doesn't change frequently
  user: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
  
  // Course data - longer stale time, course content is relatively static
  courses: {
    staleTime: 15 * 60 * 1000, // 15 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
  },
  
  // Course details - very long stale time, detailed course info rarely changes
  courseDetails: {
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 2 * 60 * 60 * 1000, // 2 hours
  },
  
  // Universities and static data - very long cache
  universities: {
    staleTime: 60 * 60 * 1000, // 1 hour
    cacheTime: 24 * 60 * 60 * 1000, // 24 hours
  },
  
  // Search results - short stale time, search results can be dynamic
  search: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  },
  
  // Analytics and dashboard data - short stale time for fresh data
  analytics: {
    staleTime: 1 * 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
  },
  
  // Trending/popular content - medium stale time
  trending: {
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
  },
};

// Browser cache headers for different content types
export const cacheHeaders = {
  // Static assets - very long cache
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
    'Expires': new Date(Date.now() + 31536000000).toUTCString(),
  },
  
  // API responses - short cache with revalidation
  api: {
    'Cache-Control': 'public, max-age=300, must-revalidate', // 5 minutes
    'ETag': true,
  },
  
  // Images - long cache with revalidation
  images: {
    'Cache-Control': 'public, max-age=86400, must-revalidate', // 24 hours
  },
  
  // HTML pages - short cache
  html: {
    'Cache-Control': 'public, max-age=300, must-revalidate', // 5 minutes
  },
};

// Local storage cache manager
class LocalStorageCache {
  private prefix = 'elira_cache_';
  private maxAge = 24 * 60 * 60 * 1000; // 24 hours default

  set(key: string, data: any, maxAge?: number): void {
    try {
      const item = {
        data,
        timestamp: Date.now(),
        maxAge: maxAge || this.maxAge,
      };
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (error) {
      console.warn('Failed to cache data to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const now = Date.now();

      if (now - parsed.timestamp > parsed.maxAge) {
        this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Clean expired items
  cleanup(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        this.get(key); // This will remove expired items
      }
    });
  }
}

export const localCache = new LocalStorageCache();

// Session storage for temporary data
class SessionStorageCache {
  private prefix = 'elira_session_';

  set(key: string, data: any): void {
    try {
      sessionStorage.setItem(this.prefix + key, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to cache data to sessionStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.warn('Failed to retrieve session cached data:', error);
      return null;
    }
  }

  remove(key: string): void {
    sessionStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

export const sessionCache = new SessionStorageCache();

// Memory cache for component-level caching
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; maxAge: number }>();
  private maxSize = 100; // Maximum number of items

  set(key: string, data: any, maxAge: number = 5 * 60 * 1000): void {
    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      maxAge,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    if (now - item.timestamp > item.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    const now = Date.now();
    if (now - item.timestamp > item.maxAge) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean expired items
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

export const memoryCache = new MemoryCache();

// Cache invalidation strategies
export const cacheInvalidation = {
  // Invalidate user-related caches when user data changes
  user: () => {
    memoryCache.remove('user');
    localCache.remove('user_preferences');
    sessionCache.remove('user_session');
  },

  // Invalidate course caches when course data is updated
  courses: (courseId?: number) => {
    if (courseId) {
      memoryCache.remove(`course_${courseId}`);
      memoryCache.remove(`course_details_${courseId}`);
    } else {
      // Clear all course-related caches
      memoryCache.clear();
      localCache.remove('courses_trending');
      localCache.remove('courses_popular');
    }
  },

  // Invalidate search caches
  search: () => {
    memoryCache.remove('search_results');
    sessionCache.remove('recent_searches');
  },

  // Clear all caches
  all: () => {
    memoryCache.clear();
    localCache.clear();
    sessionCache.clear();
  },
};

// Automatic cache cleanup on app start and periodically
export function initCacheCleanup(): void {
  // Clean expired items on app start
  localCache.cleanup();
  memoryCache.cleanup();

  // Set up periodic cleanup (every 30 minutes)
  setInterval(() => {
    localCache.cleanup();
    memoryCache.cleanup();
  }, 30 * 60 * 1000);

  // Clean up when page visibility changes (tab becomes hidden)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      memoryCache.cleanup();
    }
  });
}

// Cache warming for critical data
export async function warmCache(): Promise<void> {
  try {
    // Pre-fetch critical data that's likely to be needed
    const criticalEndpoints = [
      '/api/courses/trending',
      '/api/universities',
      '/api/courses?limit=20',
    ];

    // Fetch in parallel but don't wait for completion
    criticalEndpoints.forEach(endpoint => {
      fetch(endpoint)
        .then(response => response.json())
        .then(data => {
          const cacheKey = endpoint.replace('/api/', '');
          localCache.set(cacheKey, data, cacheConfig.courses.cacheTime);
        })
        .catch(() => {
          // Silently handle cache warming errors
        });
    });
  } catch (error) {
    console.warn('Cache warming failed:', error);
  }
}