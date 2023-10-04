import { AxiosPromise } from "axios";

import useApiService from "./use_api_service";


// Define the `usePrioritiesService` custom hook which encapsulates the `prioritiesService` functionality and uses the `useApiService` custom hook to perform API requests for fetching priorities
const usePrioritiesService = () => {
    const [apiService] = useApiService();

    const prioritiesService = {
        fetchPriorities: async (): Promise<AxiosPromise> => apiService("get", { path: "/priorities", params: {} })
    }

    return prioritiesService;
};

export default usePrioritiesService;