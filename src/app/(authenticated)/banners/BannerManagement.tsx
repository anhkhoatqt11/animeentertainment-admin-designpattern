"use client"

import { useBanners } from "@/hooks/useBanners";
import AlbumBannerCollection from "./(components)/AlbumBannerCollection"
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";


export function BannerManagement() {

    const { fetchBanners } = useBanners();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const onFetch = async () => {
            await fetchBanners().then((res) => {
                setBannerList(res);
            });
            setIsLoading(false);
        };
        onFetch();
    }, [])

    const [bannerList, setBannerList] = useState([]);

    return (
        <>
            <div className="relative min-h-[1032px]">
                <AlbumBannerCollection bannerList={bannerList} setBannerList={setBannerList} />
                {isLoading ? (
                    <div className="w-full h-full bg-gray-200 z-10 absolute top-0">
                        <div className="w-full h-screen flex items-center justify-center ">
                            <Loader />
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    )
}