import { getRequest, postRequest } from "@/lib/fetch";

export const useAnimeEpisodes = () => {
  const createNewEpisode = async (data) => {
    const res = await postRequest({
      endPoint: "/api/animes/anime-episodes/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editEpisode = async (data) => {
    const res = await postRequest({
      endPoint: "/api/animes/anime-episodes/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteEpisode = async (data) => {
    const res = await postRequest({
      endPoint: "/api/animes/anime-episodes/delete",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const fetchAllAdvertisements = async () => {
    const res = await getRequest({
      endPoint: `/api/animes/advertisement`,
    });
    return res;
  };

  return {
    createNewEpisode,
    editEpisode,
    deleteEpisode,
    fetchAllAdvertisements,
  };
};
