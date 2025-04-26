import { getRequest, postRequest } from "@/lib/fetch";

export const useComicChapters = () => {
  const createNewChapter = async (data) => {
    const res = await postRequest({
      endPoint: "/api/comics/comic-chapters/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editChapter = async (data) => {
    const res = await postRequest({
      endPoint: "/api/comics/comic-chapters/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteChapter = async (data) => {
    const res = await postRequest({
      endPoint: "/api/comics/comic-chapters/delete",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  return {
    createNewChapter,
    editChapter,
    deleteChapter,
  };
};
