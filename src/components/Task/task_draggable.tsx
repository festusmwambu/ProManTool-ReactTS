import { Draggable } from "react-beautiful-dnd";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { deleteTaskAsync } from "../../features/board/boardSlice";
import { fetchTaskAsync, selectTaskInfo, selectTaskLoading } from "../../features/taskDescription/taskDescriptionSlice";
import Task from "./task";
import "./task.scss";


interface TaskDraggableProps {
    id: number;
    title: string;
    index: number;
    priority?:string;
}

const TaskDraggable = ({ id, title, index, priority }: TaskDraggableProps) => {
    const dispatch = useAppDispatch();

    const taskInfo = useAppSelector(selectTaskInfo);

    const taskLoading = useAppSelector(selectTaskLoading);

    const handleFetchTask = () => {
        // Check if the task to fetch is not already fetched.
        const alreadyFetched = id === taskInfo?.id;

        if (!alreadyFetched && !taskLoading) {
            dispatch(fetchTaskAsync(id));
        }
    };

    const handleDeleteTask = () => {
        dispatch(deleteTaskAsync(id));
    };

    return (
        <Draggable key={id} draggableId={id.toString()} index={index}>
            {provided => (
                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...provided.draggableProps.style }}>
                    <Task id={id} title={title} priority={priority} handleDeleteTask={handleDeleteTask} handleInfoClick={handleFetchTask} />
                </div>
            )}
        </Draggable>
    );
};

export default TaskDraggable;