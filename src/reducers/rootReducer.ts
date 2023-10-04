import { combineReducers } from "@reduxjs/toolkit";

import boardSlice, { BoardSliceProps } from "../features/board/boardSlice";
import sessionSlice, { SessionSliceProps } from "../features/session/sessionSlice";
import boardsSlice, { BoardsSliceProps } from "../features/boards/boardsSlice";
import taskDescriptionSlice, { TaskDescriptionSliceProps } from "../features/taskDescription/taskDescriptionSlice";



export interface RootReducerProps {
    session: SessionSliceProps,
    board: BoardSliceProps,
    boards: BoardsSliceProps,
    taskDescription: TaskDescriptionSliceProps,
}

const rootReducer = combineReducers<RootReducerProps>({
    session: sessionSlice,
    board: boardSlice,
    boards: boardsSlice,
    taskDescription: taskDescriptionSlice,
});

export default rootReducer;