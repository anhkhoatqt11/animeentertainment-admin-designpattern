import { ImageProxy } from '@/lib/imageProxy';

/**
 * Image Cache Manager for Proxy Pattern
 * Provides utilities to manage the image cache
 */
export class ImageCacheManager {
  private static preloadingUrls: Set<string> = new Set();
  private static preloadedPages: Set<string> = new Set();

  /**
   * Preload a list of image URLs using the proxy pattern
   * This allows caching images before they are actually needed
   */
  static async preloadImages(urls: string[]): Promise<void> {
    // Filter out URLs that are already being preloaded or cached
    const urlsToPreload = urls.filter(url => {
      if (!url || typeof url !== 'string') return false;
      if (this.preloadingUrls.has(url)) return false;
      
      // Check if already cached
      const proxy = new ImageProxy(url);
      if (proxy.isLoaded()) return false;
      
      return true;
    });

    if (urlsToPreload.length === 0) {
      console.log(`[ImageCacheManager] No new images to preload`);
      return;
    }

    console.log(`[ImageCacheManager] Preloading ${urlsToPreload.length} new images`);
    
    // Mark URLs as being preloaded
    urlsToPreload.forEach(url => this.preloadingUrls.add(url));

    const preloadPromises = urlsToPreload.map(async (url) => {
      try {
        const proxy = new ImageProxy(url);
        await proxy.load();
        console.log(`[ImageCacheManager] Preloaded: ${url}`);
      } catch (error) {
        console.warn(`[ImageCacheManager] Failed to preload: ${url}`, error);
      } finally {
        // Remove from preloading set when done
        this.preloadingUrls.delete(url);
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log(`[ImageCacheManager] Preloading completed for ${urlsToPreload.length} images`);
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
    this.preloadingUrls.clear();
    this.preloadedPages.clear();
    console.log('[ImageCacheManager] Cache cleared');
  }

  /**
   * Remove specific images from cache
   */
  static removeFromCache(urls: string[]): void {
    urls.forEach(url => {
      ImageProxy.removeFromCache(url);
      this.preloadingUrls.delete(url);
    });
    console.log(`[ImageCacheManager] Removed ${urls.length} items from cache`);
  }

  /**
   * Preload images for current page items with duplicate prevention
   */
  static preloadPageImages(items: any[]): Promise<void> {
    const imageUrls = items
      .map(item => item.landspaceImage)
      .filter(url => url && typeof url === 'string');
    
    // Create a unique key for this page
    const pageKey = imageUrls.sort().join(',');
    
    // Check if we've already preloaded this exact set of images
    if (this.preloadedPages.has(pageKey)) {
      console.log('[ImageCacheManager] Page images already preloaded');
      return Promise.resolve();
    }
    
    // Mark this page as preloaded
    this.preloadedPages.add(pageKey);
    
    return this.preloadImages(imageUrls);
  }

  /**
   * Preload images for next page (predictive caching) with duplicate prevention
   */
  static async preloadNextPageImages(
    fetchFunction: (page: number) => Promise<any>,
    currentPage: number
  ): Promise<void> {
    const nextPage = currentPage + 1;
    const pageKey = `next-page-${nextPage}`;
    
    // Check if we've already preloaded this next page
    if (this.preloadedPages.has(pageKey)) {
      console.log(`[ImageCacheManager] Next page ${nextPage} already preloaded`);
      return;
    }

    try {
      console.log(`[ImageCacheManager] Preloading next page: ${nextPage}`);
      this.preloadedPages.add(pageKey);
      
      const nextPageData = await fetchFunction(nextPage);
      if (nextPageData?.data || nextPageData) {
        const data = nextPageData?.data || nextPageData;
        await this.preloadPageImages(data);
      }
    } catch (error) {
      // Remove from preloaded set if failed
      this.preloadedPages.delete(pageKey);
      console.warn('[ImageCacheManager] Failed to preload next page images:', error);
    }
  }
}
