import React, { useEffect, useState } from "react";
import { useDonates } from "@/hooks/useDonates";
import { useQuery } from "@tanstack/react-query";
import Loader from "@/components/Loader";
import DonatePackageItem from "./DonatePackageItem";
import { Pagination } from "@nextui-org/react";

const DonatePackageList = ({ props, isLoaded, setIsLoaded }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { fetchAllDonatePackage } = useDonates();

  const { data, refetch } = useQuery({
    queryKey: [
      ["donates", currentPage],
      ["name", props],
    ],
    queryFn: () => fetchAllDonatePackage(currentPage, props),
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
          <div className="w-full h-full p-4 grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {data?.data.map((item) => (
              <DonatePackageItem item={item} key={`anime-${item.id}`} />
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
};

export default DonatePackageList;
