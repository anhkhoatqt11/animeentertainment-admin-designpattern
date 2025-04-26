import { getRequest, postRequest } from "@/lib/fetch";

export const useNotification = () => {
  const fetchNewestChapter = async () => {
    const res = await getRequest({
      endPoint: `/api/notification/get-newest-chapter`,
    });
    return res;
  };

  const fetchNewestEpisode = async () => {
    const res = await getRequest({
      endPoint: `/api/notification/get-newest-episode`,
    });
    return res;
  };

  const sendNotification = async (data) => {
    const res = await postRequest({
      endPoint: "/api/notification/send-notification",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  return {
    fetchNewestChapter,
    fetchNewestEpisode,
    sendNotification,
  };
};
