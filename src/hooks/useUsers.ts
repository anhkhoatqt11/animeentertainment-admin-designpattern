import { getRequest, postRequest } from "@/lib/fetch";

export const useUsers = () => {
  const fetchUsersChallengePoint = async () => {
    const res = await getRequest({
      endPoint: `/api/user/challenge`,
    });
    return res;
  };

  const fetchAllUsers = async (page, limit, name, status) => {
    const res = await getRequest({
      endPoint: `/api/user/all?name=${name}&page=${page}&limit=${limit}&status=${status}`,
    });
    console.log(res);
    return res;
  };

  const editAccessCommentDate = async (data) => {
    const res = await postRequest({
      endPoint: "/api/user/update-access-time",
      isFormData: false,
      formData: data,
    });
    return res;
  };
  return { fetchUsersChallengePoint, fetchAllUsers, editAccessCommentDate };
};
