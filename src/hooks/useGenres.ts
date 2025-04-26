import { getRequest, postRequest } from "@/lib/fetch";

export const useGenres = () => {
  const fetchAllGenres = async () => {
    const res = await getRequest({
      endPoint: `/api/genres`,
    });
    return res;
  };

  return {
    fetchAllGenres,
  };
};
