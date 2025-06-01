import React from 'react';
import { Loader2, BookOpen, Users, Clock, GraduationCap } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// Generic loading spinner
export function LoadingSpinner({ size = 'default', className = '' }: { 
  size?: 'sm' | 'default' | 'lg'; 
  className?: string; 
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

// Enhanced course card loading skeleton
export function CourseCardSkeleton() {
  return (
    <Card className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <CardHeader className="p-0">
        <Skeleton className="h-48 w-full rounded-t-lg bg-gray-200 dark:bg-gray-700" />
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {/* Course title */}
        <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
        
        {/* Course description lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700" />
        </div>
        
        {/* University and level */}
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-16 bg-gray-200 dark:bg-gray-700" />
          <div className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-700" />
        </div>
        
        {/* Price and button */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-20 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-8 w-24 rounded-md bg-gray-200 dark:bg-gray-700" />
        </div>
      </CardContent>
    </Card>
  );
}

// Course grid loading
export function CourseGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Dashboard stats loading
export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Table loading skeleton
export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-6 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

// Full page loading with proper contrast
export function PageLoadingSpinner({ message = "Betöltés..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
          <BookOpen className="absolute inset-0 m-auto h-8 w-8 text-blue-600 dark:text-blue-400" />
        </div>
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{message}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">Kérjük, várjon...</p>
      </div>
    </div>
  );
}

// Inline loading for buttons
export function ButtonLoading({ children, loading, ...props }: { 
  children: React.ReactNode; 
  loading: boolean;
  [key: string]: any;
}) {
  return (
    <button disabled={loading} {...props}>
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  );
}

// Content loading with context
export function ContentLoadingState({ 
  type = 'courses',
  message,
  icon: Icon
}: { 
  type?: 'courses' | 'users' | 'analytics';
  message?: string;
  icon?: React.ComponentType<any>;
}) {
  const config = {
    courses: {
      icon: BookOpen,
      message: message || 'Kurzusok betöltése...',
      color: 'text-blue-600 dark:text-blue-400'
    },
    users: {
      icon: Users,
      message: message || 'Felhasználók betöltése...',
      color: 'text-green-600 dark:text-green-400'
    },
    analytics: {
      icon: Clock,
      message: message || 'Adatok elemzése...',
      color: 'text-purple-600 dark:text-purple-400'
    }
  };

  const { icon: DefaultIcon, message: defaultMessage, color } = config[type];
  const LoadingIcon = Icon || DefaultIcon;

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-white dark:bg-gray-900">
      <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 ${color}`}>
        <LoadingIcon className="h-8 w-8" />
      </div>
      <LoadingSpinner size="lg" className="text-blue-600 dark:text-blue-400" />
      <p className="text-gray-800 dark:text-gray-200 text-center max-w-md">
        {message || defaultMessage}
      </p>
    </div>
  );
}

// Search loading state
export function SearchLoadingState() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-muted-foreground">Keresés folyamatban...</span>
      </div>
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex space-x-3 p-3 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}