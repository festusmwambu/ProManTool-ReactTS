import { AxiosPromise } from "axios";

import useApiService from "./use_api_service";


// Create a custom hook `useBoardsService` to provide functions for fetching, creating, deleting, and manipulating boards. 
const useBoardsService = () => {
    // Make use of the `apiService` function from `useApiService` custom hook to provide `http method`, `path`, and optional `params`.
    const [apiService] = useApiService();
    
    // `boardService` function will be used to provide fetching, creating, deleting, and updating board.
    const boardsService = {
        fetchBoards: async (): Promise<AxiosPromise> => apiService("get", { path: "/boards", params: {} }), 
        createBoard: async (boardName: string): Promise<AxiosPromise> => apiService("post", { path: "/boards", params: { boardName} }),
        fetchBoard: async (boardId: number): Promise<AxiosPromise> => apiService("get", { path: `/boards/${boardId}`, params: {} }),
        deleteBoard: async (boardId: number): Promise<AxiosPromise> => apiService("delete", { path: `/boards/${boardId}`, params: {} }),
        createBoardList: async (boardId: number, listTitle: string): Promise<AxiosPromise> => apiService("post", { path: `/boards/${boardId}/lists`, params: {title: listTitle} }),
    };

    return boardsService;
};

export default useBoardsService;