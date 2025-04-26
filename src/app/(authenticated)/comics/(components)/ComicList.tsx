"use client";

import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import React, { use, useEffect } from "react";
import { useState } from "react";
import ComicItemCard from "./ComicItemCard";
import { Pagination } from "@nextui-org/react";
import { useComics } from "@/hooks/useComics";

function ComicList({ props, sort, isLoaded, setIsLoaded }) {
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchAllComics } = useComics();

  const { data, refetch } = useQuery({
    queryKey: [
      ["comics", currentPage],
      ["name", props],
      ["sort", sort],
    ],
    queryFn: () => fetchAllComics(props, sort, currentPage),
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
          <div className="w-full p-4 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {data?.data.map((item) => (
              <ComicItemCard item={item} key={`comic-${item.id}`} />
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

export default ComicList;
