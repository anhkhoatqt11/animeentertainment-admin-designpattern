import React, { useEffect, useState } from 'react';
import { useImageProxy } from '@/hooks/useImageProxy';
import { cn } from '@/lib/utils';

interface ProxyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: string) => void;
  lazy?: boolean;
  loading?: 'eager' | 'lazy';
}

/**
 * ProxyImage Component implementing the Proxy Design Pattern
 * Features:
 * - Lazy initialization of image loading
 * - Automatic caching through proxy pattern
 * - Loading states and error handling
 * - Intersection Observer for lazy loading
 */
export const ProxyImage: React.FC<ProxyImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc,
  placeholder,
  onLoad,
  onError,
  lazy = true,
  loading = 'lazy',
}) => {
  const { isLoading, isLoaded, error, imageUrl, loadImage, retryLoad } = useImageProxy(src);
  const [inView, setInView] = useState(!lazy);
  const [imgRef, setImgRef] = useState<HTMLDivElement | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || !imgRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log(`[ProxyImage] Image entered viewport: ${src}`);
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    observer.observe(imgRef);

    return () => {
      observer.disconnect();
    };
  }, [imgRef, lazy, src]);

  // Load image when in view
  useEffect(() => {
    if (inView && src && !isLoaded && !isLoading) {
      console.log(`[ProxyImage] Starting lazy load for: ${src}`);
      loadImage();
    }
  }, [inView, src, isLoaded, isLoading, loadImage]);

  // Notify parent components of load/error events
  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Handle retry on error
  const handleRetry = () => {
    console.log(`[ProxyImage] Retrying load for: ${src}`);
    retryLoad();
  };

  // Render loading placeholder
  if (!inView || isLoading) {
    return (
      <div
        ref={setImgRef}
        className={cn(
          'flex items-center justify-center bg-gray-100 animate-pulse',
          className
        )}
      >
        {placeholder || (
          <div className="flex flex-col items-center justify-center space-y-2 p-4">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <span className="text-xs text-gray-500">Loading...</span>
          </div>
        )}
      </div>
    );
  }

  // Render error state with retry option
  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center bg-red-50 border border-red-200 rounded',
          className
        )}
      >
        <div className="text-center p-4">
          <div className="text-red-500 text-sm mb-2">Failed to load image</div>
          <button
            onClick={handleRetry}
            className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
          {fallbackSrc && (
            <img
              src={fallbackSrc}
              alt={alt}
              className={cn('mt-2', className)}
              loading={loading}
            />
          )}
        </div>
      </div>
    );
  }

  // Render loaded image
  if (isLoaded && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={cn('transition-opacity duration-300 opacity-100', className)}
        loading={loading}
        onLoad={() => {
          console.log(`[ProxyImage] Image rendered successfully: ${src}`);
        }}
      />
    );
  }

  // Fallback
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-100',
        className
      )}
    >
      <span className="text-gray-400 text-sm">No Image</span>
    </div>
  );
};
