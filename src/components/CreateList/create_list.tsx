import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { createBoardListAsync } from "../../features/board/boardSlice";
import { trackEvent } from "../../utils/ga_util";
import Loading from "../Loading/loading";
import "./create_list.scss";



interface CreateListForm {
    listTitle: string;
}

const CreateList = () => {
    const { handleSubmit, register, reset } = useForm<CreateListForm>();

    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useAppDispatch();

    // Use `useParams` to get the "id" parameter from the route.
    const { id } = useParams(); 

    // Convert "id" to a number if it's not null.
    const currentBoardId: number | null = id !== null ? Number(id) : null;

    // Use `useAppSelector` to select data from the Redux store.
    const boardId = useAppSelector(state => state.root.board.id); 

    const onSubmit = async ({ listTitle }: CreateListForm) => {
        setIsLoading(true);

        // Use `boardId` from either useParams or Redux store depending on your needs.
        const selectedBoardId: number | null = currentBoardId !== null ? currentBoardId : boardId;

        // Check if selectedBoardId is not null before dispatching
        if (selectedBoardId !== null) {
            // Dispatch the createBoardListAsync thunk middleware using the useAppDispatch hook.
            // Use `await` to ensure the dispatch returns a promise.
            await dispatch<any>(createBoardListAsync(selectedBoardId, listTitle));

            trackEvent({
                category: "Lists",
                action: "list created successfully",
            });
            reset();

            setIsLoading(false);
        }
    };

    return (
        <div className="create-list">
            <div className="create-list__header">
                <h6 className="create-list__header-title">CREATE LIST</h6>
            </div>
            <Loading display={isLoading} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <input className="form-control" placeholder="Introduce a new title for this list..." {...register("listTitle", { required: "Required" })} />
                    <button type="submit" className="btn btn--block">Create</button>
                </div>
            </form>
        </div>
    );
};

export default CreateList;