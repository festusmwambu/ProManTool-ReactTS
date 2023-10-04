import { TaskInterface } from "./task_interface";

export interface ListInterface {
    id: number;
    title: string;
    tasks: TaskInterface[];
}