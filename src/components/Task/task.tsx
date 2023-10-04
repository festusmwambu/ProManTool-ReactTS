import cn from "classnames";
import "./task.scss";



interface TaskProps {
    id: number;
    title: string;
    priority?: string;
    handleDeleteTask: () => void;
    handleInfoClick: () => void;
}

const Task = ({ id, title, priority, handleDeleteTask, handleInfoClick }: TaskProps) => {
    const priorityLabels: { [key: string]: string } = {
        LOW: "Low priority",
        MEDIUM: "Medium priority",
        HIGH: "High priority",
    };
    
    const parsePriority = (priorityToParse: string): string => {
        return priorityLabels[priorityToParse] || priorityToParse;
    };

    return (
        <div className="task">
            <div className="task__header">
                <p className="task__header-title">{title}</p> 
                <p className="tsk__header-id">#{id}</p>
            </div>
            <div className="task__body">
                <div className="task__body-priority">
                    {priority && (
                        <>
                            <div className={cn("task__body-priority__bubble", { 
                                "task__body-priority__bubble--low": priority === "LOW",
                                "task__body-priority__bubble--medium": priority === "MEDIUM",
                                "task__body-priority__bubble--high": priority === "HIGH"
                            })}></div>
                            <span className="task__body-priority__value">
                                {parsePriority(priority)}
                            </span>
                        </>
                    )}
                </div>
                <div className="task__body-icons">
                    <i onClick={() => handleDeleteTask()} className="far fa-trash-alt task__body-icon" />
                    <i onClick={() => handleInfoClick()} className="far fa-question-circle task__body-icon" />
                </div>
            </div>
        </div>
    );
};

export default Task;