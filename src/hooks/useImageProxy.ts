import { useState, useEffect, useRef } from 'react';
import { createImageProxy, ImageLoadingState, ImageInterface } from '@/lib/imageProxy';

/**
 * Custom hook that implements the Proxy Design Pattern for image loading
 * Provides lazy initialization and caching capabilities
 */
export function useImageProxy(imageUrl: string): ImageLoadingState & {
  loadImage: () => Promise<void>;
  retryLoad: () => Promise<void>;
} {
  const [state, setState] = useState<ImageLoadingState>({
    isLoading: false,
    isLoaded: false,
    error: null,
    imageUrl: null,
  });

  const imageProxyRef = useRef<ImageInterface | null>(null);
  const mountedRef = useRef(true);

  // Initialize proxy only when needed (lazy initialization)
  const initializeProxy = () => {
    if (!imageProxyRef.current && imageUrl) {
      console.log(`[useImageProxy] Initializing proxy for: ${imageUrl}`);
      imageProxyRef.current = createImageProxy(imageUrl);
    }
  };

  const loadImage = async (): Promise<void> => {
    if (!imageUrl || state.isLoaded) return;

    initializeProxy();
    
    if (!imageProxyRef.current) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Check if already loaded (from cache)
      if (imageProxyRef.current.isLoaded()) {
        console.log(`[useImageProxy] Image already loaded: ${imageUrl}`);
        if (mountedRef.current) {
          setState({
            isLoading: false,
            isLoaded: true,
            error: null,
            imageUrl: imageProxyRef.current.getUrl(),
          });
        }
        return;
      }

      // Load through proxy (handles caching internally)
      const loadedUrl = await imageProxyRef.current.load();
      
      if (mountedRef.current) {
        setState({
          isLoading: false,
          isLoaded: true,
          error: null,
          imageUrl: loadedUrl,
        });
      }
    } catch (error) {
      console.error(`[useImageProxy] Failed to load image:`, error);
      if (mountedRef.current) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load image',
        }));
      }
    }
  };

  const retryLoad = async (): Promise<void> => {
    setState(prev => ({ ...prev, error: null, isLoaded: false }));
    await loadImage();
  };

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Reset state when URL changes
  useEffect(() => {
    imageProxyRef.current = null;
    setState({
      isLoading: false,
      isLoaded: false,
      error: null,
      imageUrl: null,
    });
  }, [imageUrl]);

  return {
    ...state,
    loadImage,
    retryLoad,
  };
}
