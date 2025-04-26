import { getRequest, postRequest } from "@/lib/fetch";

export const useComics = () => {
  const fetchAllComics = async (name, sort, page) => {
    const res = await getRequest({
      endPoint: `/api/comics?name=${name}&page=${page}&limit=15&sort=${sort}`,
    });
    return res;
  };

  const fetchComicById = async (id) => {
    const res = await getRequest({
      endPoint: `/api/comics/comics-detail?comicId=${id}`,
    });
    return res;
  };

  const createNewComic = async (data) => {
    const res = await postRequest({
      endPoint: "/api/comics/comics-detail/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editComic = async (data) => {
    const res = await postRequest({
      endPoint: "/api/comics/comics-detail/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteComic = async (data) => {
    const res = await postRequest({
      endPoint: "/api/comics/comics-detail/delete",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  return {
    fetchAllComics,
    fetchComicById,
    createNewComic,
    editComic,
    deleteComic,
  };
};
