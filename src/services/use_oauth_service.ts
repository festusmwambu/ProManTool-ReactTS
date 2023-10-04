import { useEffect } from "react";
import { AxiosPromise } from "axios";

import useApiService from "./use_api_service";


interface Params {
    code: string;
    state: string;
}

const useOAuthService = () => {
    // Provide the required arguments (path and params) from type `ApiServiceProps` to the `useApiService` custom hook function.
    // Destructure the function from the tuple.
    const [apiService] = useApiService();

    const oAuthService = async({ code, state }: Params): Promise<AxiosPromise> => {
        // Use the `apiService` function returned by `useApiService` custom hook function
        return apiService("post", { path: "/oauth/github", params: { code, state } });
    };

    // Example of using useEffect hook
    useEffect(() => {
        // Add useEffect logic here
    }, []);

    return { oAuthService };
};

export default useOAuthService;