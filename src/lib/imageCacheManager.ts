import { ImageProxy } from '@/lib/imageProxy';

/**
 * Image Cache Manager for Proxy Pattern
 * Provides utilities to manage the image cache
 */
export class ImageCacheManager {
  /**
   * Preload a list of image URLs using the proxy pattern
   * This allows caching images before they are actually needed
   */
  static async preloadImages(urls: string[]): Promise<void> {
    console.log(`[ImageCacheManager] Preloading ${urls.length} images`);
    
    const preloadPromises = urls.map(async (url) => {
      try {
        const proxy = new ImageProxy(url);
        await proxy.load();
        console.log(`[ImageCacheManager] Preloaded: ${url}`);
      } catch (error) {
        console.warn(`[ImageCacheManager] Failed to preload: ${url}`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log(`[ImageCacheManager] Preloading completed`);
  }

  /**
   * Get current cache statistics
   */
  static getCacheStats(): {
    size: number;
    items: string[];
  } {
    const size = ImageProxy.getCacheSize();
    return {
      size,
      items: [], // We don't expose cache keys for privacy
    };
  }

  /**
   * Clear the entire image cache
   */
  static clearCache(): void {
    ImageProxy.clearCache();
    console.log('[ImageCacheManager] Cache cleared');
  }

  /**
   * Remove specific images from cache
   */
  static removeFromCache(urls: string[]): void {
    urls.forEach(url => {
      ImageProxy.removeFromCache(url);
    });
    console.log(`[ImageCacheManager] Removed ${urls.length} items from cache`);
  }

  /**
   * Preload images for current page items
   */
  static preloadPageImages(items: any[]): Promise<void> {
    const imageUrls = items
      .map(item => item.landspaceImage)
      .filter(url => url && typeof url === 'string');
    
    return this.preloadImages(imageUrls);
  }

  /**
   * Preload images for next page (predictive caching)
   */
  static async preloadNextPageImages(
    fetchFunction: (page: number) => Promise<any>,
    currentPage: number
  ): Promise<void> {
    try {
      console.log(`[ImageCacheManager] Preloading next page: ${currentPage + 1}`);
      const nextPageData = await fetchFunction(currentPage + 1);
      if (nextPageData?.data) {
        await this.preloadPageImages(nextPageData.data);
      }
    } catch (error) {
      console.warn('[ImageCacheManager] Failed to preload next page images:', error);
    }
  }
}
