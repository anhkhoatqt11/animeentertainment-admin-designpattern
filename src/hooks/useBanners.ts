import { getRequest, postRequest } from "@/lib/fetch";


export const useBanners = () => {
    const fetchBanners = async () => {
        const res = await getRequest({
            endPoint: `/api/banners`,
        });
        return res;
    }

    const fetchComicList = async () => {
        const res = await getRequest({
            endPoint: `/api/comics/comic-list`,
        });
        return res;
    };

    const fetchAnimeList = async () => {
        const res = await getRequest({
            endPoint: `/api/animes/anime-list`,
        });
        return res;
    };

    const editBanner = async (data) => {
        const res = await postRequest({
            endPoint: "/api/banners/edit",
            isFormData: false,
            formData: data,
        });
        return res;
    }


    return {
        fetchBanners,
        fetchComicList,
        fetchAnimeList,
        editBanner
    }
}