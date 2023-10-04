import { AxiosPromise } from "axios";

import useApiService from "./use_api_service";


// Define the `useTasksService` custom hook, which encapsulates the `tasksService` functionality and uses `useApiService` custom hook to perform API requests for the various task operations
const useTasksService = () => {
    const [apiService] = useApiService();

    const tasksService = {
        fetchTask: async (taskId: number): Promise<AxiosPromise> => apiService("get", { path: `/tasks/${taskId}`, params: {} }),
        deleteTask: async (taskId: number): Promise<AxiosPromise> => apiService("delete", { path: `/tasks/${taskId}`, params: {} }),
        updateTaskList: async (taskId: number, listId: number, position: number): Promise<AxiosPromise> => apiService("patch", { path: `/tasks/${taskId}/list`, params: { listId, position } }),
        updateTaskDescription: async (taskId: number, description: string): Promise<AxiosPromise> => apiService("patch", { path: `/tasks/${taskId}/description`, params: { description } }),
        updateTaskTitle: async (taskId: number, title: string): Promise<AxiosPromise> => apiService("patch", { path: `/tasks/${taskId}/title`, params: { title } }),
        updateTaskPriority: async (taskId: number, priorityId: number): Promise<AxiosPromise> => apiService("patch", { path: `/tasks/${taskId}/priority`, params: { priority: priorityId } })
    }

    return tasksService;
};

export default useTasksService;