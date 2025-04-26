import { getRequest, postRequest } from "@/lib/fetch";

export const useDonates = () => {
  const fetchAllDonatePackage = async (page, searchWord) => {
    const res = await getRequest({
      endPoint: `/api/donate?page=${page}&limit=12&name=${searchWord}`,
    });
    return res;
  };

  const fetchDonatePackageById = async (id) => {
    const res = await getRequest({
      endPoint: `/api/donate/detail?id=${id}`,
    });
    return res;
  }

  const fetchDonatorById = async (id) => {
    const res = await getRequest({
      endPoint: `/api/donate/donator?id=${id}`
    });
    return res;
  }

  const addDonatePackage = async (data) => {
    const res = await postRequest({
      endPoint: "/api/donate/add",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const updateDonatePackage = async (data) => {
    const res = await postRequest({
      endPoint: "/api/donate/edit",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  return {
    fetchAllDonatePackage,
    addDonatePackage,
    fetchDonatePackageById,
    fetchDonatorById,
    updateDonatePackage,
  };
};
