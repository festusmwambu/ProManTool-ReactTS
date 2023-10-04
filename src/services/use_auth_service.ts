import { AxiosPromise } from "axios";

import useApiService from "./use_api_service";


export interface Params {
    username: string;
    password: string;
}

// Combine `login`, `signup`, and `reconnect` parameters into a single object called `AuthType` to specify authentication type.
type AuthType =  "login" | "signup" | "reconnect";

// Create a custom hook `useAuthService`.
const useAuthService = () => {
    // Make use of the `apiService` function from `useApiService` custom hook to provide `http method`, `path`, and optional `params`.
    const [apiService] = useApiService();

    // `authService` function takes `AuthType` argument (either `login`, `signup` or `reconnect`) and sets the appropriate `path` and optional `params` properties for the authentication request and then calls `apiService` with the specified HTTP method and path.
    const authService = async(type: AuthType, { username, password }: Params): Promise<AxiosPromise> => {
        const authPaths = {
            login: "/auth/login",
            signup: "/auth/signup",
            reconnect: "/auth/reconnect",
        }
        
        const path = authPaths[type];

        if (!path) {
            throw new Error("Invalid authentication type");
        }

        return apiService("post", { path: path, params: { username, password } });
    };

        return { authService };
        
    }

export default useAuthService;