import { useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";

import useBoardsService from "../../services/use_boards_service";
import { trackEvent } from "../../utils/ga_util";
import ConfirmationModal from "../ConfirmationModal/confirmation_modal";
import "./board_card.scss";


export interface BoardCardProps {
    className?: string;
    boardInfo: {
        id: number;
        title: string;
    } 
    onDelete?: () => void;
}

// Declarations of the board component.
const BoardCard = ({ className, boardInfo, onDelete }: BoardCardProps) => {
    // Initialize the boards service.
    const boardsService = useBoardsService();

    //State to control the delete confirmation model.
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Function to handle the board deletion.
    const handleDelete = async(cb: () => void) => {
        try {
            // Delete the board using the boards service.
            await boardsService.deleteBoard(boardInfo.id);

            // Track the event using Google Analytics.
            trackEvent({
                category: "Boards",
                action: "Board Deleted",
            });

            // Call the onDelete callback if provided.
            onDelete?.();
        } catch(err) {
            // Handle errors by logging to the console.
            console.error(err);
        } finally {
            // Ensure the callback is called, whether an error occurred or not.
            cb();
        }
    };

    return (
        <div className={cn("boardcard", className)}>
            {onDelete && (
                <>
                    {/* Confirmation modal for board deletion */}
                    <ConfirmationModal 
                        title="DELETE BOARD"
                        description="Are you sure you want to delete this board?. All tasks will be lost."
                        isOpen={deleteModalOpen}
                        onSuccess={handleDelete}
                        onCancel={() => setDeleteModalOpen(false)}
                    />

                    {/* Delete icon to open the confirmation modal */}
                    <i 
                        onClick={() => setDeleteModalOpen(true)}
                        className="far fa-trash-alt boardcard__delete-icon"
                    />
                </>
            )}
            
            {/* Link to the board details page */}
            <Link to={"/boards/" + boardInfo.id} className="text-decoration-none">
                <div className="boardcard__header">
                    {/* Display the board title */}
                    <h5 className="boardcard__header-title">{boardInfo.title}</h5>
                </div>
            </Link>
        </div>
    );
};

export default BoardCard;