import { ListInterface } from "./list_interface";
import { PriorityInterface } from "./priority_interface";

export interface BoardInterface {
    id: number;
    title: string;
    lists?: ListInterface[];
    priorities?: PriorityInterface[];
}