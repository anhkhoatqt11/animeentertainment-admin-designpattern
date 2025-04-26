import { getRequest, postRequest } from "@/lib/fetch";

export const useAdvertisement = () => {
  const fetchAllAdvertisement = async () => {
    const res = await getRequest({
      endPoint: `/api/advertisements`,
    });
    return res;
  };

  const fetchEpisodeToShow = async () => {
    const res = await getRequest({
      endPoint: `/api/advertisements/list_episode`,
    });
    return res;
  };

  const createAdvertisement = async (data) => {
    const res = await postRequest({
      endPoint: "/api/advertisements/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const editAdvertisement = async (data) => {
    const res = await postRequest({
      endPoint: "/api/advertisements/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const processingOrder = async (data) => {
    const res = await postRequest({
      endPoint: "/api/advertisements/process_order",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const test = async () => {
    const res = await postRequest({
      endPoint: "/api/test",
      isFormData: false,
      formData: { data: "" },
    });
    return res;
  };

  const fetchOrder = async (id) => {
    const res = await getRequest({
      endPoint: `/api/advertisements/history?id=${id}`
    });
    return res;
  }

  return {
    fetchAllAdvertisement,
    fetchEpisodeToShow,
    createAdvertisement,
    editAdvertisement,
    processingOrder,
    fetchOrder,
    test,
  };
};
