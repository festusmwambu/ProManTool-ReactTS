import { ChangeEvent, MouseEvent, useState } from "react";
import { useForm } from "react-hook-form";
import cogoToast from "cogo-toast";
import cn from "classnames";
import dayjs from "dayjs";

import { resetStateSync, selectTaskInfo, selectTaskLoading, selectTaskVisible, updateTaskDescriptionAsync, updateTaskPriorityAsync, updateTaskTitleAsync } from "../../features/taskDescription/taskDescriptionSlice";
import { selectPriorities, updateTaskPrioritySync, updateTaskTitleSync } from "../../features/board/boardSlice";
import { trackEvent } from "../../utils/ga_util";
import Loading from "../Loading/loading";
import EditableText from "../EditableText/editable_text";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import "./task_description.scss";



interface TaskDescriptionForm {
    description: string;
}

const TaskDescription = () => {
    const task = useAppSelector(selectTaskInfo) // Use useAppSelector to get task info state.
    
    const visible = useAppSelector(selectTaskVisible) // Use useAppSelector to get visibility state.
    
    const loading = useAppSelector(selectTaskLoading) // Use useAppSelector to get loading state.
    
    const priorities = useAppSelector(selectPriorities) // Use useAppSelector to get priorities state.

    const dispatch = useAppDispatch(); // Use useAppDispatch to get the dispatch function

    const [isEditingDescription, setIsEditingDescription] = useState(false);

    const { handleSubmit, register } = useForm<TaskDescriptionForm>();


    const onSubmit = ({ description }: TaskDescriptionForm) => {
        if (!task) {
            return; // Handle the case where task is undefined
        }

        if (task?.description === description) {
            return cogoToast.warn("Description cannot be the same 🤨", { position: "bottom-right" });
        };

        dispatch(updateTaskDescriptionAsync(task?.id ?? 0, description))
            .then(() => {
                trackEvent({ 
                    category: "Tasks",
                    action: "Updated task description successfully", 
                });

                setIsEditingDescription(false);

                cogoToast.success("Task description updated successfully", { position: "bottom-right" });
            });
    };

    const toggleDescription = (event: MouseEvent<HTMLElement>) => {
        event.preventDefault();
        setIsEditingDescription(!isEditingDescription);
    };

    const copyToClipboard = (id: string | number) => {
        navigator.clipboard.writeText(`Task id: #${id}`);

        trackEvent({
            category: "Tasks",
            action: "Id copied to clipboard", 
        });

        cogoToast.success("Id copied to clipboard successfully.", { position: "bottom-right" });
    };

    const priorityLabels: {
        [key: string]: string;
        LOW: string;
        MEDIUM: string;
        HIGH: string;
    } = {
        LOW: "Low priority",
        MEDIUM: "Medium priority",
        HIGH: "Highest priority",
    };

    const parsePriority = (priority: string) => priorityLabels[priority] || priority;

    const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const priorityIdString = event.target.value;

        const priorityId = parseInt(priorityIdString);

        if (!task) {
            return; // Handle the case where task is undefined
        }
        
        dispatch(updateTaskPriorityAsync(task?.id, priorityId))
            .then(() => {
                trackEvent({
                    category: "Tasks",
                    action: "Updated task priority successfully", 
                });

                dispatch(updateTaskPrioritySync(task?.id, priorityId));
            });
    };

    const handleTitleEdit = (text: string, callback: () => void) => {
        if (!task) {
            return; // Handle the case where task is undefined
        }

        dispatch(updateTaskTitleAsync(task?.id, text))
            .then(() => {
                trackEvent({
                    category: "Tasks",
                    action: "Updated title",
                });

                dispatch(updateTaskTitleSync(task.id, text));
            });
            
            callback();
    };

    return (
        <div className={cn("task-description", { "task-description--visible": visible })}>
            <Loading display={loading} />

            <div className="task-description__header">
                <EditableText text={task?.title} tag={"h3"} textClassName="task-description__header-title" onSuccess={handleTitleEdit} />

                <span onClick={() => copyToClipboard(task?.id ?? 0)} className="task-description__header-id">
                    #{task?.id}
                </span>

                <i onClick={() => dispatch(resetStateSync())} className="fas fa-arrow-right fa-lg task-description__header-arrow" />
            </div>

            <hr />

            <div className="task-description__sections">
                <div>
                    <p>
                        <strong>Created:</strong>
                    </p>
                    <p>{task?.createdAt ? dayjs(task?.createdAt).format("DD/MM/YYYY [At] HH:MM") : "No date available"}</p>
                </div>

                <div>
                    <p>
                        <strong>Priority:</strong>
                    </p>

                    <select onChange={handlePriorityChange}>
                        {priorities.map(priority => (
                            <option key={`priority_${priority.id}`} value={priority.id} defaultChecked={priority.value === task?.priority}>
                                {parsePriority(priority.value)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="task-description__sections-description">
                    <p>
                        <strong>Description</strong>
                    </p>

                    {!isEditingDescription ? (
                        <>
                            <p>
                                {task?.description || "Description not provided"}
                            </p>
                            <button onClick={toggleDescription}>
                                Edit description
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="task-description__sections-description__textarea">
                                <textarea id="description" rows={5} {...register("description", { required: "Required" })} defaultValue={task?.description}></textarea>
                            </div>

                            <div className="task-description__sections-description__buttons">
                                <button type="submit" className="btn btn--info btn--sm">
                                    Submit
                                </button>
                                <button type="button" onClick={toggleDescription} className="btn btn--danger btn--sm">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};


export default TaskDescription;