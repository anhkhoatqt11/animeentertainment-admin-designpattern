"use client";

import Loader from "@/components/Loader";
import { useAnimes } from "@/hooks/useAnimes";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useCallback, useMemo } from "react";
import { useState } from "react";
import AnimeItemCard from "./AnimeItemCard";
import { Pagination } from "@nextui-org/react";
import { ImageCacheManager } from "@/lib/imageCacheManager";

function AnimeList({ props, sort, isLoaded, setIsLoaded }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageLoadingStats, setImageLoadingStats] = useState({ cached: 0, loading: 0 });

  const { fetchAllAnimes } = useAnimes();

  // Memoize query key to prevent unnecessary refetches
  const queryKey = useMemo(() => [
    "animes",
    currentPage,
    props,
    sort,
  ], [currentPage, props, sort]);

  // Memoize fetch function to prevent dependency changes
  const memoizedFetchFunction = useCallback(
    () => fetchAllAnimes(props, sort, currentPage),
    [fetchAllAnimes, props, sort, currentPage]
  );

  const { data, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: memoizedFetchFunction,
    staleTime: 60 * 1000 * 5, // Increased stale time to 5 minutes
    cacheTime: 60 * 1000 * 10, // Cache for 10 minutes
    keepPreviousData: true,
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent automatic refetch on mount
    onSuccess: () => {
      setIsLoaded(true);
    },
  });  // Memoized preload function to prevent recreating on every render
  const preloadCurrentPageImages = useCallback(async (animeData) => {
    if (!animeData || !Array.isArray(animeData)) return;
    
    console.log(`[AnimeList] Starting image preloading for ${animeData.length} items`);
    
    try {
      await ImageCacheManager.preloadPageImages(animeData);
      const stats = ImageCacheManager.getCacheStats();
      setImageLoadingStats({ cached: stats.size, loading: 0 });
      console.log(`[AnimeList] Current page images preloaded. Cache size: ${stats.size}`);
    } catch (error) {
      console.error('[AnimeList] Error preloading images:', error);
    }
  }, []);

  // Memoized predictive cache function
  const preloadNextPageImages = useCallback(async () => {
    try {
      await ImageCacheManager.preloadNextPageImages(
        (page) => fetchAllAnimes(props, sort, page),
        currentPage
      );
    } catch (error) {
      console.error('[AnimeList] Error preloading next page images:', error);
    }
  }, [fetchAllAnimes, props, sort, currentPage]);

  // Optimized preloading effect with debouncing
  useEffect(() => {
    const animeData = data?.data || data;
    if (!animeData || !Array.isArray(animeData) || isFetching) return;

    // Debounce image preloading to prevent excessive calls
    const timeoutId = setTimeout(() => {
      preloadCurrentPageImages(animeData);
      
      // Preload next page images after a delay
      setTimeout(() => {
        preloadNextPageImages();
      }, 2000); // Increased delay to avoid blocking
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [data, isFetching, preloadCurrentPageImages, preloadNextPageImages]);
  const onPageChange = useCallback((page) => {
    if (page === currentPage) return; // Prevent unnecessary state updates
    
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage(page);

    // Update loading stats
    setImageLoadingStats(prev => ({ ...prev, loading: prev.loading + 1 }));
  }, [currentPage]);

  // Remove the unnecessary refetch effect that was causing performance issues
  // The useQuery will automatically fetch when the component mounts or dependencies change

  // Clear cache when component unmounts
  useEffect(() => {
    return () => {
      console.log('[AnimeList] Component unmounting, keeping cache for better UX');
      // Optional: Clear cache on unmount
      // ImageCacheManager.clearCache();
    };
  }, []);
  // Memoize anime data to prevent unnecessary re-renders
  const animeItems = useMemo(() => {
    return (data?.data || data) || [];
  }, [data]);

  // Memoize pagination total to prevent recalculation
  const totalPages = useMemo(() => {
    return data?.data?.totalPages || Math.ceil((animeItems.length || 0) / 9) || 1;
  }, [data?.data?.totalPages, animeItems.length]);

  return (
    <div>
      {!isLoaded || isFetching ? (
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
                Page Loading: {imageLoadingStats.loading} |
                Fetching: {isFetching ? 'Yes' : 'No'}
              </div>
            </div>
          )}
          <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {animeItems.map((item) => (
              <AnimeItemCard item={item} key={`anime-${item.id || item._id}`} />
            ))}
          </div>
          <div className="flex justify-center pb-5">
            <Pagination
              color="primary"
              showControls
              total={totalPages}
              initialPage={1}
              onChange={onPageChange}
              page={currentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AnimeList;
