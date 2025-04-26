import { getRequest, postRequest } from "@/lib/fetch";

export const useAnimes = () => {
  const fetchAllAnimes = async (name, sort, page) => {
    console.log(sort, name);
    const res = await getRequest({
      endPoint: `/api/animes?name=${name}&page=${page}&limit=9&sort=${sort}`,
    });
    console.log(res);
    return res;
  };

  const fetchAnimeById = async (id) => {
    const res = await getRequest({
      endPoint: `/api/animes/animes-detail?animeId=${id}`,
    });
    return res;
  };

  const createNewAnime = async (data) => {
    const res = await postRequest({
      endPoint: "/api/animes/animes-detail/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editAnime = async (data) => {
    const res = await postRequest({
      endPoint: "/api/animes/animes-detail/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteAnime = async (data) => {
    const res = await postRequest({
      endPoint: "/api/animes/animes-detail/delete",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  return {
    fetchAllAnimes,
    fetchAnimeById,
    createNewAnime,
    editAnime,
    deleteAnime,
  };
};
