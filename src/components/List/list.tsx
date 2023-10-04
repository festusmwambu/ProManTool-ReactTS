import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";

import { editListTitleAsync } from "../../features/board/boardSlice";
import { TaskInterface } from "../../interfaces/task_interface";
import { trackEvent } from "../../utils/ga_util";
import ConfirmationModal from "../ConfirmationModal/confirmation_modal";
import EditableText from "../EditableText/editable_text";
import TaskDraggable from "../Task/task_draggable";
import CreateTask from "../CreateTask/create_task";
import { useAppDispatch } from "../../app/hooks";
import "./list.scss";



interface ListProps {
    id: number;
    title: string;
    tasks: TaskInterface[];
    onDelete?(): void;
}

const List = ({ id, title, tasks, onDelete }: ListProps) => {
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const dispatch = useAppDispatch();

    const listId = id; // Add this line to capture the listId

    const handleDelete = (callback: () => void) => {
        if (onDelete) {
            onDelete();
        }
        
        setDeleteModalOpen(false);

        trackEvent({
            category: "Lists",
            action: "Deleted list items successfully",
            value: listId,
        });

        callback();
    };

    const getListStyles = () => ({
        width: "100%",
        minHeight: 5,
        maxHeight: 350,
        overflowX: "hidden" as "hidden", // Explicitly specify the type
        overflowY: "auto" as "auto", // Explicit specify the type
        display: "flex",
        flexDirection: "column" as "column", // Explicitly specify the type
    });

    const handleEditTitle = (value: string, callback: () => void) => {
        dispatch(editListTitleAsync(value, listId)); 

        trackEvent({
            category: "Lists",
            action: "Title edited successfully",
            value: listId
        });

        callback();
    };


    return (
        <div className="list">
            {onDelete && (
                <>
                    <ConfirmationModal
                        isOpen={deleteModalOpen}
                        title="DELETE LIST"
                        description="Are you sure you want to delete this list items?. All tasks will be lost."
                        onSuccess={handleDelete}
                        onCancel={() => setDeleteModalOpen(false)}
                    />
                    <i onClick={() => setDeleteModalOpen(true)} className="far fa-sm fa-trash-alt list__delete-icon" />
                </>
            )}

            <div className="list__header">
                <EditableText
                    text={title}
                    tag="h5"
                    textClassName="list__header-title"
                    onSuccess={handleEditTitle}
                />
            </div>

            <div className="list__body">
                <Droppable key={`${title}_${id}`} droppableId={id.toString()}>
                    {provided => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={getListStyles()}>
                            {tasks.map((task: TaskInterface, index: number) => (
                                <TaskDraggable key={task.uid} {...task} index={index} />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>

            <div className="list__footer">
                <CreateTask listId={listId} />
            </div>
        </div>
    );
};

export default List;