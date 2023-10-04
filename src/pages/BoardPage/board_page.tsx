import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";

import { trackEvent, trackPageView } from "../../utils/ga_util";
import { deleteListAsync, fetchBoardAsync, fetchPrioritiesAsync, moveTaskAsync, resetStateSync, sortListTasksAsync } from "../../features/board/boardSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Loading from "../../components/Loading/loading";
import TaskDescription from "../../components/TaskDescription/task_description";
import List from "../../components/List/list";
import CreateList from "../../components/CreateList/create_list";
import { RootState } from "../../app/store";



const BoardPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    const { id } = useParams();

    const boardId = id ? parseInt(id, 10) : undefined; // Parse id as an integer (base 10)

    const dispatch = useAppDispatch(); // Use `useAppDispatch` to dispatch actions

    const board = useAppSelector((state: RootState) => state.root.board);

    const fetchData = async () => {
        try {
            dispatch(fetchPrioritiesAsync());

            if (boardId !== undefined) {
                dispatch(fetchBoardAsync(boardId));

                setIsLoading(false);
            }
        } catch (err) {
            // Handle error here.
            console.error("Error fetching board data", err);
        }
    };
    
    useEffect(() => {
        trackPageView("Board");

        fetchData();

        dispatch(fetchPrioritiesAsync());

        return () => {
            dispatch(resetStateSync());
        }
    }, [boardId, dispatch]);

    const onDragEnd = (event: any) => {
        const { draggableId, source, destination } = event;

        const taskId = parseInt(draggableId);

        const originListId = parseInt(source.droppableId);

        const destinationListId = parseInt(destination.droppableId);

        if (originListId !== destinationListId) {
            trackEvent({
                category: "Lists",
                action: "Task moved to another list",
            });

            dispatch(moveTaskAsync(originListId, destinationListId, taskId, destination.index));
        } else {
            trackEvent({
                category: "Tasks",
                action: "Updated task position successfully",
            });

            dispatch(sortListTasksAsync(originListId, taskId, source.index, destination.index));
        }
    };

    const onListDelete = (listId: number) => {
        trackEvent({
            category: "Lists",
            action: "List deleted successfully",
        });

        dispatch(deleteListAsync(listId));
    };

    return (
        <div className="board">
            <Loading display={isLoading} />
            <TaskDescription />
            <h1 className="board__title">{board.title}</h1>
            <div className="board__columns">
                <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
                    {board.lists?.map((list) => (
                            <List key={list.id} onDelete={() => onListDelete(list.id)} {...list} />
                    ))}
                </DragDropContext>
                <CreateList />
            </div>
        </div>
    );
};

export default BoardPage;