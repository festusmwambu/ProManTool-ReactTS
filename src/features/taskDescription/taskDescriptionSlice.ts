import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";

import { TaskInterface } from "../../interfaces/task_interface";
import { RootState } from "../../app/store";
import { selectPriorities } from "../board/boardSlice";
import useTasksService from "../../services/use_tasks_service";




export interface TaskDescriptionSliceProps {
    taskVisible: boolean;
    taskLoading: boolean;
    taskError: string;
    taskInfo: TaskInterface | undefined;
}

const defaultState: TaskDescriptionSliceProps = {
    taskVisible: false,
    taskLoading: false,
    taskError: "",
    taskInfo: undefined,
};

const taskDescriptionSlice = createSlice({
    name: "taskDescription",
    initialState: defaultState,
    reducers: {
        setVisibilitySuccess: (state, action: PayloadAction<boolean>) => {
            state.taskVisible = action.payload;
        },

        setLoadingSuccess: (state, action: PayloadAction<boolean>) => {
            state.taskLoading = action.payload;
        },

        fetchTaskSuccess: (state, action: PayloadAction<TaskInterface>) => {
            state.taskLoading = false;
            state.taskInfo = action.payload;
        },

        updateTaskPrioritySuccess: (state, action: PayloadAction<string>) => {
            state.taskLoading = false;

            if (state.taskInfo) {
                state.taskInfo.priority = action.payload;
            }
        },

        updateTaskDescriptionSuccess: (state, action: PayloadAction<string>) => {
            state.taskLoading = false;

            if (state.taskInfo) {
                state.taskInfo.description = action.payload;
            }
        },

        updateTaskTitleSuccess: (state, action: PayloadAction<string>) => {
            state.taskLoading = false;

            if (state.taskInfo) {
                state.taskInfo.title = action.payload;
            }
        },

        resetStateSuccess: () => {
            return defaultState;
        },
    },
});


// Export `action creators` as named exports for use in Redux `store` setup.
export const { setVisibilitySuccess, setLoadingSuccess, fetchTaskSuccess, updateTaskPrioritySuccess, updateTaskDescriptionSuccess, updateTaskTitleSuccess, resetStateSuccess } = taskDescriptionSlice.actions;



// Define `thunk middlewares` that allows to write `sync or async action creators` that return a function instead of an action.
// Rather than executing some logic now, `thunk middlewares` can be used to perform the work later.
// `Thunk middlewares` are a pattern of writing functions with logic inside them that can interact with a Redux store's `dispatch` and `getState` methods.
export const setVisibilitySync = (state: Boolean): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    dispatch(setVisibilitySuccess(state=true));
};

export const setLoadingSync = (state: Boolean): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    dispatch(setLoadingSuccess(state=true));
};

export const fetchTaskAsync = (taskId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    const tasksService = useTasksService();

    dispatch(setVisibilitySuccess(true));
    dispatch(setLoadingSuccess(true));

    const response  = await tasksService.fetchTask(taskId);

    dispatch(fetchTaskSuccess(response.data));
};

export const updateTaskPriorityAsync = (taskId: number, priorityId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    const tasksService = useTasksService();

    dispatch(setLoadingSuccess(true));
        
    const state = getState();
    const priorities = selectPriorities(state);
    const priority = priorities.find((p) => p.id === priorityId);

    await tasksService.updateTaskPriority(taskId, priorityId);

    dispatch(updateTaskPrioritySuccess(priority?.value || ""));
};

export const updateTaskDescriptionAsync = (taskId: number, description: string): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    const tasksService = useTasksService();

    dispatch(setLoadingSuccess(true));

    await tasksService.updateTaskDescription(taskId, description);

    dispatch(updateTaskDescriptionSuccess(description));
};

export const updateTaskTitleAsync = (taskId: number, title: string): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    const tasksService = useTasksService();

    dispatch(setLoadingSuccess(true));

    await tasksService.updateTaskTitle(taskId, title);

    dispatch(updateTaskTitleSuccess(title));
};

export const resetStateSync = (): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    dispatch(resetStateSuccess());
};



// Define `selectors` to access the tasks state from the `rootReducer`.
export const selectTaskVisible = (state: RootState): boolean => state.root.taskDescription.taskVisible;
export const selectTaskLoading = (state: RootState): boolean => state.root.taskDescription.taskLoading;
export const selectTaskInfo = (state: RootState): TaskInterface | undefined => state.root.taskDescription.taskInfo; // Return `TaskInterface | undefined`, to acknowledge that `taskInfo` might be `undefined`. Later handle this possibility when using `selectTaskInfo` selector in your code.
export const selectTaskId = (state: RootState): number => state.root.taskDescription.taskInfo?.id || 0; // `state.taskDescription.taskInfo?.id` will return `undefined` if `taskInfo` is `undefined`, and `0` will be used as the default value in that case.



// Export the `slice reducer` for use in the Redux store setup.
export default taskDescriptionSlice.reducer;