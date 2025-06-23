# Proxy Design Pattern Implementation for Image Caching

## Overview

This implementation demonstrates the **Proxy Design Pattern** applied to image loading and caching in the AnimeList component. The pattern provides lazy initialization and intelligent caching for better performance and user experience.

## Pattern Components

### 1. ImageInterface (Subject Interface)
```typescript
export interface ImageInterface {
  load(): Promise<string>;
  getUrl(): string;
  isLoaded(): boolean;
}
```

### 2. RealImage (Real Subject)
- **Location**: `src/lib/imageProxy.ts`
- **Purpose**: Handles actual image loading
- **Features**:
  - Lazy loading with Promise-based async loading
  - Load state tracking
  - Error handling with retry capability

### 3. ImageProxy (Proxy)
- **Location**: `src/lib/imageProxy.ts`
- **Purpose**: Controls access to RealImage with caching
- **Features**:
  - **Lazy Initialization**: Creates RealImage only when needed
  - **Caching**: Static Map-based cache for loaded images
  - **Cache Management**: Methods for clearing and managing cache

## Implementation Details

### Lazy Initialization
```typescript
// Proxy only creates RealImage when load() is called
if (!this.realImage) {
  console.log(`[ProxyPattern] Creating new RealImage instance for: ${this.url}`);
  this.realImage = new RealImage(this.url);
}
```

### Caching Mechanism
```typescript
// Check cache first before creating new instances
if (ImageProxy.cache.has(this.url)) {
  this.realImage = ImageProxy.cache.get(this.url)!;
  console.log(`[ProxyPattern] Image loaded from cache: ${this.url}`);
  return this.realImage.getUrl();
}
```

### React Integration

#### useImageProxy Hook
- **Location**: `src/hooks/useImageProxy.ts`
- **Purpose**: React hook wrapper for the proxy pattern
- **Features**:
  - Loading state management
  - Error handling and retry functionality
  - Component cleanup

#### ProxyImage Component
- **Location**: `src/components/ProxyImage.tsx`
- **Purpose**: React component using the proxy pattern
- **Features**:
  - Intersection Observer for lazy loading
  - Loading placeholders
  - Error state with retry button
  - Fallback image support

### Cache Management

#### ImageCacheManager
- **Location**: `src/lib/imageCacheManager.ts`
- **Purpose**: High-level cache management utilities
- **Features**:
  - **Preloading**: Load images before they're needed
  - **Predictive Caching**: Preload next page images
  - **Cache Statistics**: Monitor cache performance
  - **Cache Control**: Clear, remove specific items

## Usage in AnimeList

### 1. Basic Implementation
```typescript
// AnimeItemCard.tsx - Replace standard img with ProxyImage
<ProxyImage
  src={item.landspaceImage}
  alt={item.movieName}
  className="object-cover h-full w-full transition-transform group-hover:scale-125 duration-300"
  lazy={true}
  fallbackSrc="/placeholder.svg"
  onLoad={() => console.log(`Image loaded for: ${item.movieName}`)}
  onError={(error) => console.error(`Image error:`, error)}
/>
```

### 2. Advanced Caching Strategy
```typescript
// AnimeList.tsx - Preload current and next page images
useEffect(() => {
  const animeData = data?.data || data;
  if (animeData && Array.isArray(animeData)) {
    // Preload current page images
    ImageCacheManager.preloadPageImages(animeData);
    
    // Preload next page images (predictive caching)
    setTimeout(() => {
      ImageCacheManager.preloadNextPageImages(
        (page) => fetchAllAnimes(props, sort, page),
        currentPage
      );
    }, 1000);
  }
}, [data, currentPage]);
```

## Benefits

### 1. Performance Improvements
- **Reduced Load Times**: Cached images load instantly
- **Bandwidth Optimization**: Images loaded only once
- **Predictive Loading**: Next page images preloaded

### 2. User Experience
- **Smooth Scrolling**: No image loading delays
- **Offline Capability**: Cached images work offline
- **Progressive Loading**: Lazy loading with intersection observer

### 3. Memory Management
- **Controlled Caching**: Explicit cache management
- **Lazy Initialization**: Memory allocated only when needed
- **Cache Statistics**: Monitor and optimize memory usage

## Development Features

### Debug Information
```typescript
// Cache statistics shown in development
{process.env.NODE_ENV === 'development' && (
  <div className="p-2 mb-4 bg-blue-50 border border-blue-200 rounded text-sm">
    <div className="font-semibold text-blue-800">🔄 Proxy Pattern Cache Stats:</div>
    <div className="text-blue-600">
      Cached Images: {imageLoadingStats.cached} | 
      Page Loading: {imageLoadingStats.loading}
    </div>
  </div>
)}
```

### Console Logging
- `[ProxyPattern]`: Core proxy operations
- `[ImageCacheManager]`: Cache management operations
- `[ProxyImage]`: Component-level operations
- `[useImageProxy]`: Hook-level operations
- `[AnimeList]`: Integration-level operations

## Configuration Options

### ProxyImage Props
```typescript
interface ProxyImageProps {
  src: string;                    // Image URL
  alt: string;                    // Alt text
  className?: string;             // CSS classes
  fallbackSrc?: string;          // Fallback image
  placeholder?: React.ReactNode;  // Custom loading placeholder
  onLoad?: () => void;           // Load success callback
  onError?: (error: string) => void; // Error callback
  lazy?: boolean;                // Enable lazy loading (default: true)
  loading?: 'eager' | 'lazy';    // Native loading attribute
}
```

### Cache Management
```typescript
// Clear entire cache
ImageCacheManager.clearCache();

// Get cache statistics
const stats = ImageCacheManager.getCacheStats();

// Remove specific items
ImageCacheManager.removeFromCache(['url1', 'url2']);
```

## Best Practices

1. **Preloading Strategy**: Preload visible and next page images
2. **Cache Size Management**: Monitor cache size in production
3. **Error Handling**: Provide fallback images and retry mechanisms
4. **Lazy Loading**: Use intersection observer for performance
5. **Development Debugging**: Enable console logging and stats display

## Future Enhancements

1. **Cache Size Limits**: Implement LRU cache with size limits
2. **Compression**: Add image compression before caching
3. **Service Worker**: Integrate with service worker for offline support
4. **Analytics**: Track cache hit rates and performance metrics
5. **Progressive Images**: Support for progressive image loading
