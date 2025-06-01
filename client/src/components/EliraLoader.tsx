import React from 'react';
import { cn } from "@/lib/utils";
import logo from "@assets/eliralogoicon.png";

interface EliraLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'bounce' | 'pulse' | 'spin' | 'wave' | 'typing' | 'thinking';
  message?: string;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24'
};

const messageClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg'
};

export const EliraLoader: React.FC<EliraLoaderProps> = ({
  size = 'md',
  variant = 'bounce',
  message = 'Betöltés...',
  className
}) => {
  const renderAnimation = () => {
    const logoClasses = cn(sizeClasses[size], "rounded-xl object-cover");

    switch (variant) {
      case 'bounce':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={logo} 
                alt="Elira" 
                className={cn(logoClasses, "animate-bounce shadow-lg")}
              />
              <div className="absolute inset-0 bg-blue-400 opacity-20 rounded-xl animate-pulse"></div>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        );

      case 'pulse':
        return (
          <div className="relative">
            <img 
              src={logo} 
              alt="Elira" 
              className={cn(logoClasses, "animate-pulse")}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-30 rounded-xl animate-ping"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 rounded-xl animate-pulse" style={{ animationDelay: '500ms' }}></div>
          </div>
        );

      case 'spin':
        return (
          <div className="relative">
            <div className="absolute inset-0 border-4 border-blue-200 rounded-xl"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-xl animate-spin"></div>
            <img 
              src={logo} 
              alt="Elira" 
              className={cn(logoClasses, "relative z-10 animate-pulse")}
            />
          </div>
        );

      case 'wave':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={logo} 
                alt="Elira" 
                className={cn(logoClasses, "transform transition-transform duration-1000")}
                style={{ 
                  animation: 'wave 2s ease-in-out infinite',
                  transformOrigin: 'bottom center'
                }}
              />
            </div>
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="w-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full animate-pulse"
                  style={{ 
                    height: `${8 + Math.sin(i * 0.5) * 4}px`,
                    animationDelay: `${i * 100}ms`,
                    animation: `wave-bar 1.5s ease-in-out infinite ${i * 100}ms`
                  }}
                ></div>
              ))}
            </div>
          </div>
        );

      case 'typing':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={logo} 
                alt="Elira" 
                className={cn(logoClasses, "animate-pulse")}
              />
              <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
            </div>
          </div>
        );

      case 'thinking':
        return (
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img 
                src={logo} 
                alt="Elira" 
                className={cn(logoClasses, "animate-pulse")}
              />
              <div className="absolute -top-3 -right-1">
                <div className="relative">
                  <div className="w-6 h-6 bg-white border-2 border-blue-300 rounded-full animate-bounce"></div>
                  <div className="absolute top-1 left-1 w-1 h-1 bg-blue-500 rounded-full animate-ping"></div>
                  <div className="absolute top-2 right-1 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="absolute bottom-1 left-2 w-0.5 h-0.5 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center space-x-1">
                <span className="animate-pulse">🤔</span>
                <span className="animate-bounce" style={{ animationDelay: '200ms' }}>💭</span>
                <span className="animate-pulse" style={{ animationDelay: '400ms' }}>✨</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <img 
            src={logo} 
            alt="Elira" 
            className={cn(logoClasses, "animate-spin")}
          />
        );
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-3", className)}>
      {renderAnimation()}
      {message && (
        <p className={cn(
          "text-gray-600 font-medium text-center animate-pulse",
          messageClasses[size]
        )}>
          {message}
        </p>
      )}
      

    </div>
  );
};

// Specialized loading components for different contexts
export const EliraPageLoader: React.FC<{ message?: string }> = ({ message = "Oldal betöltése..." }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <EliraLoader size="xl" variant="wave" message={message} />
  </div>
);

export const EliraButtonLoader: React.FC = () => (
  <EliraLoader size="sm" variant="spin" message="" className="py-0" />
);

export const EliraCardLoader: React.FC<{ message?: string }> = ({ message = "Betöltés..." }) => (
  <div className="flex items-center justify-center p-8">
    <EliraLoader size="md" variant="thinking" message={message} />
  </div>
);

export const EliraSearchLoader: React.FC = () => (
  <div className="flex items-center justify-center py-12">
    <EliraLoader size="lg" variant="typing" message="Keresés folyamatban..." />
  </div>
);

export const EliraAILoader: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <EliraLoader size="md" variant="thinking" message="AI elemzés folyamatban..." />
  </div>
);

export default EliraLoader;