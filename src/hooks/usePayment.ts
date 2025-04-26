import { getRequest, postRequest } from "@/lib/fetch";


export const usePayment = () => {

    const createPaymentHistory = async (data) => {
        try {
            const res = await postRequest({
                endPoint: "/api/payment/add",
                isFormData: false,
                formData: data,
            });
            console.log(res);
            return res;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const uploadZaloPaymentInfo = async (data: any) => {
        try {
            const res = await postRequest({
                endPoint: '/api/zalopay',
                isFormData: false,
                formData: data,
            });
            console.log(res);
            return res;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const uploadVNPAYPaymentInfo = async (data: any) => {
        try {
            const res = await postRequest({
                endPoint: '/api/vnpay',
                isFormData: false,
                formData: data,
            })
            console.log(res);
            return res;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    const fetchVNPayStatus = async (props = {}) => {
        const searchParams = new URLSearchParams(window.location.search);
        const endPointUrl = `/api/vnpay/ipn?${searchParams.toString()}`;

        try {
            const res = await getRequest({ endPoint: endPointUrl });
            console.log(res);
            return res;
        } catch (e) {
            console.error(e);
            return false;
        }
    }


    return {
        createPaymentHistory,
        uploadZaloPaymentInfo,
        uploadVNPAYPaymentInfo,
        fetchVNPayStatus
    }

}