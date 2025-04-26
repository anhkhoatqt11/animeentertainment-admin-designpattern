import { getRequest, postRequest } from "@/lib/fetch";

export const useChallenge = () => {
  const fetchAllQuestions = async () => {
    const res = await getRequest({
      endPoint: `/api/challenge`,
    });
    return res;
  };

  const editChallenge = async (data) => {
    const res = await postRequest({
      endPoint: "/api/challenge/update-challenge-detail",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editQuestion = async (data) => {
    const res = await postRequest({
      endPoint: "/api/challenge/question-detail/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteQuestion = async (data) => {
    const res = await postRequest({
      endPoint: "/api/challenge/question-detail/delete",
      isFormData: false,
      formData: data,
    });
  };

  const addQuestion = async (data) => {
    const res = await postRequest({
      endPoint: "/api/challenge/question-detail/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };
  return {
    fetchAllQuestions,
    editChallenge,
    editQuestion,
    deleteQuestion,
    addQuestion,
  };
};
