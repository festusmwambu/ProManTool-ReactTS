import { useEffect, useState } from 'react';

import { BoardInterface } from '../../interfaces/board_interface';
import { createBoardAsync, fetchBoardsAsync, filterBoardAsync, selectBoards } from '../../features/boards/boardsSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { trackPageView } from '../../utils/ga_util';
import CreateBoardModal from '../../components/CreateBoardModal/create_board_modal';
import Loading from '../../components/Loading/loading';
import BoardCard from '../../components/BoardCard/board_card';
import BoardsEmptyPage from './boards_empty_page';
import "./boards_page.scss";



const BoardsPage = () => {
    const [loading, setLoading] = useState(false);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const dispatch = useAppDispatch();

    const boards = useAppSelector(selectBoards);

    useEffect(() => {
        if (boards.length === 0) {
            setLoading(true);

            dispatch(fetchBoardsAsync());
            
            setLoading(false);
        }

        trackPageView("Boards");
    }, [boards.length, dispatch]);

    const createModalSuccess = (serviceResponse: { boardId: number, boardName: string }) => {
        const { boardId, boardName } = serviceResponse;

        dispatch(createBoardAsync(boardId, boardName));

        setIsModalOpen(false);
    };

    const hasBoards = () => !!boards.length;

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <CreateBoardModal isOpen={isModalOpen} onCreationSuccess={createModalSuccess} closeModal={closeModal} />
            <div className="board-page">
                <Loading display={loading} />

                {(!loading && hasBoards()) && (
                    <>
                        <div className="board-page__header">
                            <h1 className="board-page__header-title">All boards</h1>
                            <button onClick={openModal} className="btn">
                                Create Board
                            </button>
                        </div>

                        <div className="board-page__container">
                            {boards.map((board: BoardInterface) => (
                                <BoardCard key={"board_" + board.id} boardInfo={board} onDelete={() => dispatch(filterBoardAsync(board.id))} />
                            ))}
                        </div>
                    </>
                )}

                {(!loading && !hasBoards()) && (
                    <BoardsEmptyPage onBtnClick={openModal} />
                )}
            </div>
        </>
    );
};

export default BoardsPage;