import { getRequest, postRequest } from "@/lib/fetch";


export const useDashboard = () => {
    const fetchAllDashboard = async () => {
        const res = await getRequest({
            endPoint: `/api/dashboard`,
        });
        return res;
    };

    const testing = async () => {

    }

    return {
        fetchAllDashboard,
        testing
    }
}