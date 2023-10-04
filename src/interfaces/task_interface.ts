export interface TaskInterface {
    id: number;
    uid: string;
    listId: number;
    title: string;
    description?: string;
    position: number;
    createdAt?: Date;
    priority?: string;
}
