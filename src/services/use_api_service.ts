    import axios, { AxiosPromise, AxiosResponse } from 'axios';
    import { useCallback, useEffect, useState } from 'react';
    import Cookies from 'universal-cookie';

    import { API_URL } from '../config';

    interface ApiServiceProps {
        path: string;
        params?: object;
    }

    interface Options {
        headers?: {
            token?: string;
        };
        params?: object;
    }

    type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

    // Define a custom hook `useApiService`.
    const useApiService = (): [(method: HttpMethod, { path, params }: ApiServiceProps) => AxiosPromise<any>, boolean] => {
        const [loading, setLoading] = useState(false);
        const api = API_URL;
        const cookies = new Cookies();

        const token = cookies.get('token');

        // The `apiService` function now takes `method`, `path/url`, and `params` as its arguments
        const apiService = useCallback(async(method: HttpMethod, { path, params }: ApiServiceProps): Promise<AxiosResponse<any>> => {
            const fullApiPath = [api, path].join("");

            setLoading(true);

            try {
                const headers: {
                    token?: string;
                } = {};

                if (token) {
                    headers.token = token;
                }

                const options: Options = {
                    headers: {
                        token,
                    },
                    params,
                };

                const response = await axios[method](fullApiPath, options);
                
                setLoading(false);
                
                return response;
            } catch (err) {
                setLoading(false);

                throw err;
            }
        }, [api, token]);

        // Example of using the useEffect hook for any side effects or cleanup.
        useEffect(() => {
            return () => {
                // Cleanup logic here if needed
            };
        }, [])
        
        return [apiService, loading];
    };
    
    export default useApiService;