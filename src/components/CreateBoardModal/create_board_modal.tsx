import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';
import cogoToast from 'cogo-toast';

import useBoardsService from '../../services/use_boards_service';
import { trackEvent } from '../../utils/ga_util';
import Loading from "../Loading/loading";
import "./create_board_modal.scss";


// Declarations
Modal.setAppElement("#root")

const customStyles: Modal.Styles = {
    content: {
        top: "50%",
        bottom: "auto",
        left: "50%",
        right: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
    }
}

interface CreateBoardModalProps {
    isOpen: boolean;
    closeModal: () => void;
    onCreationSuccess: (data: any) => void;
    onCreationFailure: (err: any) => void;
}

interface CreateBoardModalForm {
    boardName: string;
}

const CreateBoardModal = ({ isOpen, closeModal, onCreationSuccess, onCreationFailure }: CreateBoardModalProps) => {
    const { handleSubmit, register } = useForm<CreateBoardModalForm>();

    const [ isLoading, setIsLoading ] = useState(false);

    const boardService = useBoardsService();

    const onSubmit = async ({ boardName }: CreateBoardModalForm) => {
        setIsLoading(true);

        try {
            const response = await boardService.createBoard(boardName);

            setIsLoading(false);

            trackEvent({
                category: "Boards",
                action: "Board created successfully",
            });
            
            cogoToast.success(`${boardName} has been created 😊`, { position: "bottom-right" });
            
            onCreationSuccess(response.data); 
        } catch(err) {
            trackEvent({ 
                category: "Boards",
                action: "Board creation failed",
            });

            cogoToast.error("Whoops, something happened.", { position: "bottom-right" });

            onCreationFailure(err);
        }; 
    }

    return (
        <Modal
            isOpen={isOpen}
            style={customStyles}
            onRequestClose={closeModal}
        >
            <Loading display={isLoading} />
            <div className="create-board-modal">
                <div className="create-board-modal__header">
                    <h6 className="create-board-modal__header-title">
                        Create a new board
                    </h6>

                    <i onClick={() => closeModal()} className="fas fa-times create-board-modal__header-close" />
                </div>

                <hr />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='form-group'>
                        <input className="form-control" disabled={isLoading} {...register("boardName", { required: "Required" })} placeholder="How should it be named?" />
                        <button type="submit" className="btn btn--block" disabled={isLoading}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

CreateBoardModal.defaultProps = {
    closeModal: () => {},
    onCreationSuccess: () => {},
    onCreationFailure: () => {},
};

export default CreateBoardModal;