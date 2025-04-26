import { getRequest, postRequest } from "@/lib/fetch";

export const useAlbum = () => {
  const fetchComicAlbum = async () => {
    const res = await getRequest({
      endPoint: `/api/album/comic`,
    });
    return res;
  };

  const fetchAnimeAlbum = async () => {
    const res = await getRequest({
      endPoint: `/api/album/anime`,
    });
    return res;
  };

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

  const fetchAnimeAlbumDetail = async (albumId) => {
    const res = await getRequest({
      endPoint: `/api/album/anime/detail?albumId=${albumId}`,
    });
    return res;
  };

  const fetchComicAlbumDetail = async (albumId) => {
    const res = await getRequest({
      endPoint: `/api/album/comic/detail?albumId=${albumId}`,
    });
    return res;
  };

  const createNewAnimeAlbum = async (data) => {
    const res = await postRequest({
      endPoint: "/api/album/anime/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editAnimeAlbum = async (data) => {
    const res = await postRequest({
      endPoint: "/api/album/anime/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const createNewComicAlbum = async (data) => {
    const res = await postRequest({
      endPoint: "/api/album/comic/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editComicAlbum = async (data) => {
    const res = await postRequest({
      endPoint: "/api/album/comic/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteAnimeAlbum = async (data) => {
    const res = await postRequest({
      endPoint: "/api/album/anime/delete",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteComicAlbum = async (data) => {
    const res = await postRequest({
      endPoint: "/api/album/comic/delete",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  return {
    fetchComicAlbum,
    fetchAnimeAlbum,
    fetchComicList,
    fetchAnimeList,
    fetchAnimeAlbumDetail,
    fetchComicAlbumDetail,
    createNewAnimeAlbum,
    editAnimeAlbum,
    createNewComicAlbum,
    editComicAlbum,
    deleteAnimeAlbum,
    deleteComicAlbum,
  };
};
