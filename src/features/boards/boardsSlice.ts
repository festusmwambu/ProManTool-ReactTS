import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit";

import { BoardInterface } from "../../interfaces/board_interface";
import useBoardsService from "../../services/use_boards_service";
import { RootState } from "../../app/store";



// Define the interface for the `boardsSlice`.
export interface BoardsSliceProps {
    result: BoardInterface[];
    error: string;
}

// Define the initial state of the `boardsSlice`.
const defaultState: BoardsSliceProps = {
    result: [],
    error: "",
};

// Define a thunk type for async actions.
type AppThunk = ThunkAction<void, RootState, unknown, PayloadAction<any>>;

// Create a slice for the boards, defining reducers for fetching boards, filtering boards and adding boards.
const boardsSlice = createSlice({
    name: "boards",
    initialState: defaultState,
    reducers: {
        fetchBoardsSuccess: (state, action: PayloadAction<BoardInterface[]>) => {
            state.result = action.payload;
            state.error = "";
        },

        createBoardSuccess: (state, action: PayloadAction<BoardInterface>) => {
            state.result.push(action.payload);
        }, 

        filterBoardSuccess: (state, action: PayloadAction<number>) => {
            state.result = state.result.filter((board) => board.id !== action.payload);
        },
    },
});

// Export Redux `action creators` as named exports from this "slice" file for use in the Redux store setup.
export const { fetchBoardsSuccess, createBoardSuccess, filterBoardSuccess } = boardsSlice.actions;




// Define `thunk middlewares` that allows to write `sync or async action creators` that return a function instead of an action.
// Rather than executing some logic now, `thunk middlewares` can be used to perform the work later.
// `Thunk middlewares` are a pattern of writing functions with logic inside them that can interact with a Redux store's `dispatch` and `getState` methods.
export const fetchBoardsAsync = (): AppThunk => async (dispatch) => {
    // Define `boardsService` from `useBoardsService` service to retrieve the boards actions functions.
    const boardsService = useBoardsService();

    try {
        const { data } = await boardsService.fetchBoards();

        dispatch(fetchBoardsSuccess(data));
    } catch (err) {
        // Handle error here and set error message in state.
        console.error(err);
    }
};

export const createBoardAsync = (id: number, title: string): AppThunk => async (dispatch) => {
    const newBoard: BoardInterface = { id, title };

    dispatch(createBoardSuccess(newBoard));
};

export const filterBoardAsync = (id: number): AppThunk => async (dispatch) => {
    dispatch(filterBoardSuccess(id));
};




// Define `selectors` to access the boards state from the `rootReducer`.
export const selectBoards = (state: RootState): BoardInterface[] => state.root.boards.result;




// Export the slice reducer for use in the Redux store setup.
export default boardsSlice.reducer;

