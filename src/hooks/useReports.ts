import { getRequest, postRequest } from "@/lib/fetch";

export const useReports = () => {
  const fetchAllReport = async (page, limit, status) => {
    var arr: any = [];
    status.forEach((item) => {
      arr.push(item);
    });
    const res = await getRequest({
      endPoint: `/api/reports?page=${page}&limit=${limit}&status=${arr[0]}`,
    });
    return res;
  };

  const fetchReportDetail = async (reportId) => {
    const res = await getRequest({
      endPoint: `/api/reports/detail?reportId=${reportId}`,
    });
    return res;
  };

  const editReportStatus = async (data) => {
    const res = await postRequest({
      endPoint: "/api/reports/completed",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteRecord = async (data) => {
    const res = await postRequest({
      endPoint: "/api/reports/deleted",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteParentComment = async (data) => {
    const res = await postRequest({
      endPoint: "/api/reports/detail/delete-parent-comment",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  const deleteChildComment = async (data) => {
    const res = await postRequest({
      endPoint: "/api/reports/detail/delete-child-comment",
      isFormData: false,
      formData: data,
    });
    return res;
  };

  return {
    fetchAllReport,
    fetchReportDetail,
    editReportStatus,
    deleteRecord,
    deleteParentComment,
    deleteChildComment,
  };
};
