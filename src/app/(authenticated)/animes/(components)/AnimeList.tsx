"use client";

import Loader from "@/components/Loader";
import { useAnimes } from "@/hooks/useAnimes";
import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect } from "react";
import { useState } from "react";
import AnimeItemCard from "./AnimeItemCard";
import { Pagination } from "@nextui-org/react";
import { ImageCacheManager } from "@/lib/imageCacheManager";

function AnimeList({ props, sort, isLoaded, setIsLoaded }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageLoadingStats, setImageLoadingStats] = useState({ cached: 0, loading: 0 });

  const { fetchAllAnimes } = useAnimes();

  const { data, refetch } = useQuery({
    queryKey: [
      ["animes", currentPage],
      ["name", props],
      ["sort", sort],
    ],
    queryFn: () => fetchAllAnimes(props, sort, currentPage),
    staleTime: 60 * 1000 * 1,
    keepPreviousData: true,
    onSuccess: () => {
      setIsLoaded(true);
    },
  });  // Preload images when data changes (Proxy Pattern implementation)
  useEffect(() => {
    const animeData = data?.data || data; // Handle different response structures
    if (animeData && Array.isArray(animeData)) {
      console.log(`[AnimeList] Starting image preloading for ${animeData.length} items`);

      // Preload current page images
      ImageCacheManager.preloadPageImages(animeData).then(() => {
        const stats = ImageCacheManager.getCacheStats();
        setImageLoadingStats({ cached: stats.size, loading: 0 });
        console.log(`[AnimeList] Current page images preloaded. Cache size: ${stats.size}`);
      });

      // Preload next page images (predictive caching)
      setTimeout(() => {
        ImageCacheManager.preloadNextPageImages(
          (page) => fetchAllAnimes(props, sort, page),
          currentPage
        );
      }, 1000); // Delay to avoid blocking current page rendering
    }
  }, [data, currentPage, props, sort, fetchAllAnimes]);

  const onPageChange = (page) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage(page);

    // Update loading stats
    setImageLoadingStats(prev => ({ ...prev, loading: prev.loading + 1 }));
  };

  useEffect(() => {
    refetch();
  }, []);

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      console.log('[AnimeList] Component unmounting, keeping cache for better UX');
      // Optional: Clear cache on unmount
      // ImageCacheManager.clearCache();
    };
  }, []);

  return (
    <div>
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {/* Cache Statistics for Development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-2 mb-4 bg-blue-50 border border-blue-200 rounded text-sm">
              <div className="font-semibold text-blue-800">🔄 Proxy Pattern Cache Stats:</div>
              <div className="text-blue-600">
                Cached Images: {imageLoadingStats.cached} |
                Page Loading: {imageLoadingStats.loading}
              </div>
            </div>
          )}
          <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {(data?.data || data)?.map((item) => (
              <AnimeItemCard item={item} key={`anime-${item.id}`} />
            ))}
          </div><div className="flex justify-center pb-5">
            <Pagination
              color="primary"
              showControls
              total={data?.data?.totalPages || Math.ceil((data?.data?.length || 0) / 9) || 1}
              initialPage={1}
              onChange={(page) => {
                onPageChange(page);
              }}
              page={currentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AnimeList;
