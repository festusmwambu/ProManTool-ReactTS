import { useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { useForm } from "react-hook-form";

import { createListTaskAsync } from "../../features/board/boardSlice";
import { useAppDispatch } from "../../app/hooks";
import { trackEvent } from "../../utils/ga_util";
import Loading from "../Loading/loading";
import "./create_task.scss";



interface CreateTaskProps {
    listId: number;
}

interface CreateTaskForm {
    taskTitle: string;
}

const CreateTask = ({ listId }: CreateTaskProps) => {
    const { handleSubmit, register } = useForm<CreateTaskForm>();

    const [isActive, setIsActive] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const clickOutsideRef = useOnclickOutside(() => setIsActive(false));

    const dispatch = useAppDispatch();

    const onSubmit = async({ taskTitle }: CreateTaskForm) => {
        setIsLoading(true);

        try {
            await dispatch<any>(createListTaskAsync(taskTitle, listId));

            setIsLoading(false);

            setIsActive(false);

            trackEvent({
                category: "Tasks",
                action: "Task created successfully",
            });
        } catch (err) {
            // Handle error here if needed
            console.error(err);

            setIsLoading(false);
        }
    };

    return (
        <div className="create-task" ref={clickOutsideRef}>
            <Loading display={isLoading} />
            {!isActive ? (
                <span className="create-task__placeholder" onClick={() => { setIsActive(true); }}>
                    <i className="fas fa-plus create-task__placeholder-icon" /> Create task
                </span>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <textarea className="create-task__textarea" placeholder="Introduce a title for this task..." {...register("taskTitle", { required: "Required" })}></textarea>
                        <button type="submit" className="btn btn--block">Create</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CreateTask;