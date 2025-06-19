/**
 * Image Proxy Design Pattern Implementation
 * Provides lazy initialization and caching for images
 */

export interface ImageInterface {
  load(): Promise<string>;
  getUrl(): string;
  isLoaded(): boolean;
}

// Real Image Subject
class RealImage implements ImageInterface {
  private url: string;
  private loaded: boolean = false;
  private loadPromise: Promise<string> | null = null;

  constructor(url: string) {
    this.url = url;
  }

  async load(): Promise<string> {
    if (this.loaded) {
      return this.url;
    }

    if (this.loadPromise) {
      return this.loadPromise;
    }

    this.loadPromise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loaded = true;
        console.log(`[ProxyPattern] Image loaded successfully: ${this.url}`);
        resolve(this.url);
      };
      
      img.onerror = () => {
        console.error(`[ProxyPattern] Failed to load image: ${this.url}`);
        reject(new Error(`Failed to load image: ${this.url}`));
      };
      
      img.src = this.url;
    });

    return this.loadPromise;
  }

  getUrl(): string {
    return this.url;
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}

// Image Proxy with Caching
class ImageProxy implements ImageInterface {
  private realImage: RealImage | null = null;
  private url: string;
  private static cache: Map<string, RealImage> = new Map();

  constructor(url: string) {
    this.url = url;
  }

  async load(): Promise<string> {
    // Check cache first
    if (ImageProxy.cache.has(this.url)) {
      this.realImage = ImageProxy.cache.get(this.url)!;
      console.log(`[ProxyPattern] Image loaded from cache: ${this.url}`);
      return this.realImage.getUrl();
    }

    // Lazy initialization - create real image only when needed
    if (!this.realImage) {
      console.log(`[ProxyPattern] Creating new RealImage instance for: ${this.url}`);
      this.realImage = new RealImage(this.url);
    }

    try {
      const loadedUrl = await this.realImage.load();
      // Cache the loaded image
      ImageProxy.cache.set(this.url, this.realImage);
      return loadedUrl;
    } catch (error) {
      console.error(`[ProxyPattern] Error loading image through proxy:`, error);
      throw error;
    }
  }

  getUrl(): string {
    return this.url;
  }

  isLoaded(): boolean {
    if (ImageProxy.cache.has(this.url)) {
      return ImageProxy.cache.get(this.url)!.isLoaded();
    }
    return this.realImage?.isLoaded() || false;
  }

  // Static method to clear cache
  static clearCache(): void {
    ImageProxy.cache.clear();
    console.log('[ProxyPattern] Image cache cleared');
  }

  // Static method to get cache size
  static getCacheSize(): number {
    return ImageProxy.cache.size;
  }

  // Static method to remove specific image from cache
  static removeFromCache(url: string): boolean {
    return ImageProxy.cache.delete(url);
  }
}

// Factory function to create image proxies
export function createImageProxy(url: string): ImageInterface {
  return new ImageProxy(url);
}

// Hook for managing image loading state
export interface ImageLoadingState {
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  imageUrl: string | null;
}

export { ImageProxy, RealImage };
