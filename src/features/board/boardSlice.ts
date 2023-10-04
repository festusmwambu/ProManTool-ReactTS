import { PayloadAction, ThunkAction, ThunkDispatch, createSlice } from "@reduxjs/toolkit";
import { Draft } from 'immer';
import cogoToast from "cogo-toast";

import useBoardsService from "../../services/use_boards_service";
import useListsService from "../../services/use_lists_service";
import usePrioritiesService from "../../services/use_priorities_service";
import useTasksService from "../../services/use_tasks_service";
import { BoardInterface } from "../../interfaces/board_interface";
import { ListInterface } from "../../interfaces/list_interface";
import { TaskInterface } from "../../interfaces/task_interface";
import { PriorityInterface } from "../../interfaces/priority_interface";
import { RootState } from "../../app/store";




/************************************************************************************************************************************************************************************************************************************************************************************************************************************
* In any `slice` file like this always import `createSlice` API from Redux Toolkit at the top.
* Creating any `slice` file requires a `string name` e.g. "board" to identify the slice, an `initial state value` e.g. "defaultState" or "boardState", and one or more `reducer functions` e.g. "boardReducer" to define how the state can be updated.
* Once a `slice` is created, export the generated Redux `action creators` e.g. "fetchBoardSuccess", "fetchPrioritiesSuccess" etc., and the `reducer function` e.g. "boardReducer" for the whole slice.
*********************************************************************************************************************************************************************************************************************************************************************************************************/
// Define the interface for the `boardSlice`.
export interface BoardSliceProps extends BoardInterface {

};

// Define the initial state of the `boardSlice`.
const defaultState: BoardSliceProps = {
    id: 0, // Provide a valid number for the initial state
    title: "",
    lists: [],
    priorities: [],
}

// Create a slice for the board.
const boardSlice = createSlice({
    name: "board",
    // `createSlice` will infer the state type from the `initialState` argument.
    initialState: defaultState as Draft<BoardSliceProps>, // Type cast the `initialState`.
    reducers: {
        // Give case reducer functions meaningful past-tense "event"-style names.
        // `createSlice` will automatically generate `action creators` that correspond to each case reducer function provided as shown below.
        fetchBoardSuccess: (state, action: PayloadAction<BoardSliceProps>) => {
            return {
                ...state,
                ...action.payload,
            };
        },

        fetchBoardFailure: (state) => {
            // Handle failure, e.g. redirect to 404 page
            window.location.href = "/404";
            return state;
        },

        fetchPrioritiesSuccess: (state, action: PayloadAction<PriorityInterface[]>) => {
            return {
                ...state,
                priorities: action.payload,
            };
        },

        orderTasksSuccess: (state, action: PayloadAction<{ listId: number, tasks: TaskInterface[] }>) => {
            return {
                ...state,
                lists: state.lists?.map(list => ({
                    ...list,
                    tasks: list.id === action.payload.listId ? action.payload.tasks : list.tasks,
                })),
            };
        },

        editListTitleSuccess: (state, action: PayloadAction<{ listId: number, title:string }>) => {
            return {
                ...state,
                lists: state.lists?.map(list => {
                    if (list.id === action.payload.listId) {
                        return {
                            ...list,
                            title: action.payload.title,
                        };
                    }

                    return list;
                }),
            };
        },

        updateTaskPrioritySuccess: (state, action: PayloadAction<{ taskId: number, priorityId: number }>) => {
            const newPriority: PriorityInterface | undefined = state.priorities?.find(
                (priority: PriorityInterface) => priority.id === action.payload.priorityId
            );

            return {
                ...state,
                lists: state.lists?.map(list => ({
                    ...list,
                    tasks: list.tasks.map(task => (task.id === action.payload.taskId
                        ? { ...task, priority: newPriority?.value || "" }
                        : task)),
                })),
            };
        },

        updateTaskTitleSuccess: (state, action: PayloadAction<{ taskId: number, title: string }>) => {
            return {
                ...state,
                lists: state.lists?.map(list => ({
                    ...list,
                    tasks: list.tasks.map(task => (task.id === action.payload.taskId
                        ? { ...task, title: action.payload.title }
                        : task)),
                })),
            };
        },

        moveTaskSuccess: (state, action: PayloadAction<{ 
            originListId: number;
            destinyListId: number;
            taskId: number;
            destinationIndex: number;
        }>) => {
            return {
                ...state,
                lists: state.lists?.map((list) => {
                    if (list.id === action.payload.originListId) {
                        // Remove the task from the original list
                        list.tasks = list.tasks.filter((task) => task.id !== action.payload.taskId);
                    } else if (list.id === action.payload.destinyListId) {
                        // Add the task to the destination list at the specified index
                        const task = list.tasks.find((task) => task.id === action.payload.taskId);

                        if (task) {
                            // Clone the task to ensure it is a writable draft.
                            const clonedTask = { ...task };
                            
                            // Add the cloned task to the destination list at the specified index.
                            list.tasks.splice(action.payload.destinationIndex, 0, clonedTask);
                            // Update positions in the destination list
                            list.tasks.forEach((task, i) => {
                                task.position = i;
                            });
                        }
                    }

                    return list;
                }),
            };
        },

        createBoardListSuccess: (state, action: PayloadAction<ListInterface>) => {
            return {
                ...state,
                lists: [...(state.lists || []), action.payload],
            };
        },

        addTaskSuccess: (state, action: PayloadAction<{ listId: number, newTask: TaskInterface }>) => {
            return {
                ...state,
                lists: state.lists?.map(list=> (list.id === action.payload.listId
                    ? {
                        ...list,
                        tasks: [...list.tasks, action.payload.newTask],
                    }
                    : list)),
            };
        },

        deleteTaskSuccess: (state, action: PayloadAction<{ taskId: number }>) => {
            return {
                ...state,
                lists: state.lists?.map(list => ({
                    ...list,
                    tasks: list.tasks.filter(task => task.id !== action.payload.taskId),
                })),
            };
        },

        setListsSuccess: (state, action: PayloadAction<ListInterface[]>) => {
            return {
                ...state,
                lists: action.payload,
            };
        },

        deleteListSuccess: (state, action: PayloadAction<number>) => {
            return {
                ...state,
                lists: state.lists?.filter(list => list.id !== action.payload),
            };
        },

        resetStateSuccess: () => {
            return defaultState;
        },
    },
});

// `createSlice` automatically generates `action creators` for each case `reducer function`.
// Export Redux `action creators` as named exports from this "slice" file for use in the Redux store setup.
export const { fetchBoardSuccess, fetchBoardFailure, fetchPrioritiesSuccess, orderTasksSuccess, editListTitleSuccess, updateTaskPrioritySuccess, updateTaskTitleSuccess, moveTaskSuccess, createBoardListSuccess, addTaskSuccess, deleteTaskSuccess, setListsSuccess, deleteListSuccess, resetStateSuccess } = boardSlice.actions;




// Define Redux `thunk middlewares` that allows to write `sync or async action creators` that return a function instead of an action.
// `Thunk middlewares` can be used to delay the dispatch of an action creator, or to dispatch action creators only if a certain condition is met.
// `Thunk middlewares` are a pattern of writing functions with logic inside them that can interact with a Redux store's `dispatch` and `getState` methods.
export const fetchBoardAsync = (boardId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    const boardsService = useBoardsService();

    try {
        const response = await boardsService.fetchBoard(boardId);

        const data = response.data;
        
        dispatch(fetchBoardSuccess(data));

        return data;
    } catch (err) {
        // Handle error
      console.error('Error fetching board:', err);
      throw err; // Throw the error to be caught in your component
      
      dispatch(fetchBoardFailure());
    }
};

export const fetchPrioritiesAsync = (): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    const prioritiesService = usePrioritiesService();

    try {
        const response = await prioritiesService.fetchPriorities();
        dispatch(fetchPrioritiesSuccess(response.data.result));
    } catch (err) { 
        // Handle error here
        return console.error(err);
    }
};

// Provide the correct type for getState
export const sortListTasksAsync = (listId: number, taskId: number, index: number, destinationIndex: number): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    const listsService = useListsService();

    const state: RootState = getState();

    // Check if `state.board.lists` is defined before attempting to use it. Use optional chaining (`?.`) to safely access the `lists` property.
    // Adding optional chaining (`?.`), prevent the error from occurring if `state.board.lists` is `undefined` or `null`.
    const list = state.root.board.lists?.find((l) => l.id === listId);

    if (!list) {
        // Handle the case where the list with the specified listId is not found.
        return;
    }

    // Provide a default value of an empty array `[]` when destructuring the `list.tasks` array to ensure that it's never `undefined`.
    // This way, if `list.tasks` is `undefined`, it will use an empty array as a fallback, and the `splice` operation method will work correctly.
    const [task] = (list.tasks || []).splice(index, 1);

    (list.tasks || []).splice(destinationIndex, 0, task);

    // Create the order array from the list of tasks' IDs.
    const order = (list.tasks || []).map((task) => task.id);
    
    try {
        // Assign the result of the API call to the data variable.
        await listsService.sortListTasks( order, listId);

        dispatch(orderTasksSuccess({ listId, tasks: list.tasks }));

        // Now you can use the data variable later in your code.
        // Example usage: console.log(data);
    } catch (err) {
        // Handle error here
    }
};

export const editListTitleAsync = (title: string, listId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    const listsService = useListsService();

    try {
        const response = await listsService.editListTitle(title, listId);

        dispatch(editListTitleSuccess({ title: response.data.title, listId }));
    } catch (err) {
        // Handle error here
    }
};

export const updateTaskPrioritySync = (taskId: number, priorityId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    dispatch(updateTaskPrioritySuccess({ taskId, priorityId }));
};

export const updateTaskTitleSync = ( taskId: number, title: string ): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    dispatch(updateTaskTitleSuccess({ taskId, title }));
};

export const createBoardListAsync = ( boardId: number, listTitle: string ): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    const boardsService = useBoardsService();

    try {
        const response = await boardsService.createBoardList(boardId, listTitle);

        cogoToast.success("Your list has been created...", { position: "bottom-right" });

        dispatch(createBoardListSuccess(response.data));
    } catch (err) {
        cogoToast.error("There was a problem creating your list.", { position: "bottom-right" });
    }
};

export const deleteListAsync = ( listId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    const listsService = useListsService();
    
    try {
        await listsService.deleteList(listId);

        cogoToast.info("List deleted successfully", { position: "bottom-right" });

        dispatch(deleteListSuccess(listId));
    } catch (err) {
        cogoToast.error("There was a problem deleting your list.", { position: "bottom-right" });
    }
};

export const createListTaskAsync = (taskTitle: string, listId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    const listsService = useListsService();

    try {
        const response = await listsService.createListTask(taskTitle, listId);

        cogoToast.success("Your task has been created successfully 😊", { position: "bottom-right" });

        dispatch(addTaskSuccess({ listId, newTask: response.data.result }));
    } catch (err) {
        cogoToast.error("Whops... we could not creaate your task!", { position: "bottom-right" });
    }
};

export const moveTaskAsync = (originListId: number, destinyListId: number, taskId: number, destinationIndex: number): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    const tasksService = useTasksService();
    
    const state: RootState = getState();

    const previousListsState: ListInterface[] = state.root.board.lists || [];

    dispatch(moveTaskSuccess({ originListId, destinyListId, taskId, destinationIndex }));

    try {
        await tasksService.updateTaskList(taskId, destinyListId, destinationIndex);
    } catch (err) {
        cogoToast.error("There was a problem updating your task.", { position: "bottom-right"});

        dispatch(setListsSuccess(previousListsState));
    }
};

export const deleteTaskAsync = (taskId: number): ThunkAction<void, RootState, unknown, any> => async (dispatch, getState) => {
    const tasksService = useTasksService();
    
    const state: RootState = getState();

    const previousListsState: ListInterface[] = state.root.board.lists || [];

    dispatch (deleteTaskSuccess({ taskId }));

    try {
        await tasksService.deleteTask(taskId);

        cogoToast.info("Task deleted successfully.", { position: "bottom-right" });
    } catch (err) {
        cogoToast.error("There was a problem deleting your task.", { position: "bottom-right" });

        dispatch(setListsSuccess(previousListsState));
    }
};

export const resetStateSync = (): ThunkAction<void, RootState, unknown, any> => async (dispatch) => {
    dispatch(resetStateSuccess());
};



// Define `selectors` to access the board state from the `rootReducer`.
export const getBoardId = (state: RootState): number => state.root.board.id || 0; // Assuming a default value of 0 if it's null.
export const getBoardTitle = (state: RootState): string => state.root.board.title;
export const getBoardLists = (state: RootState): ListInterface[] => state.root.board.lists || []; // By using `state.board.lists || []`, you ensure that `getBoardLists` always returns an array, either the actual list of lists or an empty array if `state.board.lists` is undefined.
export const selectPriorities = (state: RootState): PriorityInterface[] => state.root.board.priorities || []; // By using `state.board.priorities || []`, you ensure that `selectPriorities` always returns an array, either the actual list of priorities or an empty array if `state.board.priorities` is undefined.



// Export the slice reducer as the default export to be used in Redux store setup.
export default boardSlice.reducer;


