import { AxiosPromise } from "axios";
import useApiService from "./use_api_service";


// Define the `useListsService` custom hook, which encapsulates the `listsService` functionality and uses the `useApiService` custom hook to perform API requests for various list operations.
const useListsService = () => {
    const [apiService] = useApiService();

    const listsService = {
        deleteList: async (listId: number): Promise<AxiosPromise> => apiService("delete", { path: `/lists/${listId}`, params: {} }),
        createListTask: async (taskTitle: string, listId: number): Promise<AxiosPromise> => apiService("post", { path: `/lists/${listId}/task`, params: { title: taskTitle } }),
        editListTitle: async (title: string, listId: number): Promise<AxiosPromise> => apiService("patch", { path: `/lists/${listId}/title`, params: { title } }),
        sortListTasks: async (order: number[], listId: number): Promise<AxiosPromise> => apiService("post", { path: `/lists/${listId}/sort`, params: { order } }),
    };

    return listsService;
};

export default useListsService;