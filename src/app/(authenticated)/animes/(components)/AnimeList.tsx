"use client";

import Loader from "@/components/Loader";
import { useAnimes } from "@/hooks/useAnimes";
import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect } from "react";
import { useState } from "react";
import AnimeItemCard from "./AnimeItemCard";
import { Pagination } from "@nextui-org/react";

function AnimeList({ props, sort, isLoaded, setIsLoaded }) {
  const [currentPage, setCurrentPage] = useState(1);

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
  });

  const onPageChange = (page) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setCurrentPage(page);
  };

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div>
      {!isLoaded ? (
        <div className="flex h-screen items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {data?.data.map((item) => (
              <AnimeItemCard item={item} key={`anime-${item.id}`} />
            ))}
          </div>
          <div className="flex justify-center pb-5">
            <Pagination
              color="primary"
              showControls
              total={data?.totalPages}
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
