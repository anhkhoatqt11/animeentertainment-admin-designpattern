import React, { useState } from 'react';
import { ProxyImage } from '@/components/ProxyImage';
import { ImageCacheManager } from '@/lib/imageCacheManager';
import { Button } from '@/components/ui/button';

/**
 * Demo component showcasing the Proxy Design Pattern for image caching
 * This component demonstrates:
 * - Lazy initialization
 * - Image caching
 * - Cache management
 * - Performance benefits
 */
export const ProxyPatternDemo: React.FC = () => {
  const [cacheStats, setCacheStats] = useState<{ size: number; items: string[] }>({ size: 0, items: [] });
  const [showStats, setShowStats] = useState(true);

  // Sample images for demonstration
  const sampleImages = [
    "https://picsum.photos/300/200?random=1",
    "https://picsum.photos/300/200?random=2", 
    "https://picsum.photos/300/200?random=3",
    "https://picsum.photos/300/200?random=4",
    "https://picsum.photos/300/200?random=5",
    "https://picsum.photos/300/200?random=6",
  ];

  const updateCacheStats = () => {
    const stats = ImageCacheManager.getCacheStats();
    setCacheStats(stats);
  };

  const handlePreloadAll = async () => {
    console.log('[ProxyPatternDemo] Preloading all images...');
    await ImageCacheManager.preloadImages(sampleImages);
    updateCacheStats();
  };

  const handleClearCache = () => {
    ImageCacheManager.clearCache();
    updateCacheStats();
    console.log('[ProxyPatternDemo] Cache cleared');
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔄 Proxy Design Pattern Demo
        </h1>
        <p className="text-lg text-gray-600">
          Image Caching with Lazy Initialization
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            onClick={handlePreloadAll}
            className="bg-blue-500 hover:bg-blue-600"
          >
            📦 Preload All Images
          </Button>
          <Button 
            onClick={handleClearCache}
            variant="destructive"
          >
            🗑️ Clear Cache
          </Button>
          <Button 
            onClick={updateCacheStats}
            variant="outline"
          >
            📊 Update Stats
          </Button>
          <Button 
            onClick={() => setShowStats(!showStats)}
            variant="outline"
          >
            {showStats ? '👁️ Hide Stats' : '👁️ Show Stats'}
          </Button>
        </div>
      </div>

      {/* Cache Statistics */}
      {showStats && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            📈 Cache Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-blue-600">{cacheStats.size}</div>
              <div className="text-sm text-gray-600">Cached Images</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-green-600">
                {Math.round((cacheStats.size / sampleImages.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Cache Hit Rate</div>
            </div>
            <div className="bg-white p-3 rounded border">
              <div className="text-2xl font-bold text-purple-600">{sampleImages.length}</div>
              <div className="text-sm text-gray-600">Total Images</div>
            </div>
          </div>
        </div>
      )}

      {/* Pattern Explanation */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">🏗️ Pattern Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-green-700 mb-2">✅ Benefits</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Lazy Initialization:</strong> Images created only when needed</li>
              <li>• <strong>Caching:</strong> Loaded images stored for instant reuse</li>
              <li>• <strong>Performance:</strong> Reduced network requests</li>
              <li>• <strong>Memory Efficient:</strong> Shared cache across components</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">🔧 Features</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• <strong>Intersection Observer:</strong> Load images when visible</li>
              <li>• <strong>Error Handling:</strong> Fallback and retry mechanisms</li>
              <li>• <strong>Preloading:</strong> Cache images before they're needed</li>
              <li>• <strong>Cache Management:</strong> Clear, stats, and control</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-center">
          🖼️ Image Gallery (Proxy Pattern in Action)
        </h3>
        <p className="text-center text-gray-600 text-sm">
          Scroll down to see lazy loading in action. Images will be cached after first load.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleImages.map((imageUrl, index) => (
            <div key={index} className="space-y-2">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <ProxyImage
                  src={imageUrl}
                  alt={`Demo image ${index + 1}`}
                  className="w-full h-48 object-cover rounded"
                  lazy={true}
                  onLoad={() => {
                    console.log(`[ProxyPatternDemo] Image ${index + 1} loaded`);
                    updateCacheStats();
                  }}
                  onError={(error) => {
                    console.error(`[ProxyPatternDemo] Image ${index + 1} error:`, error);
                  }}
                />
              </div>
              <div className="text-center text-sm text-gray-600">
                Image {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-900 text-green-400 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-white">💻 Code Usage</h3>
        <pre className="text-sm overflow-x-auto">
{`// Using ProxyImage component
<ProxyImage
  src="https://example.com/image.jpg"
  alt="Sample image"
  className="w-full h-64 object-cover"
  lazy={true}
  fallbackSrc="/placeholder.svg"
  onLoad={() => console.log('Image loaded!')}
  onError={(error) => console.error('Error:', error)}
/>

// Preloading images
await ImageCacheManager.preloadImages([
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg'
]);

// Cache management
const stats = ImageCacheManager.getCacheStats();
ImageCacheManager.clearCache();`}
        </pre>
      </div>
    </div>
  );
};
