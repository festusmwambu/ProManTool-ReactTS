import ScrumBoard from '../../assets/images/scrum-board.png';
import "./boards_page.scss";


interface BoardsEmptyPageProps {
    onBtnClick: () => void;
}

const BoardsEmptyPage = ({ onBtnClick }: BoardsEmptyPageProps) => {
    return (
        <div className="board-page__new">
            <div>
                <h1 className="board-page__new-title">
                    You do not have any boards created
                </h1>
                <p className="board-page__new-description">
                    Within boards you can organize your job in tasks and then group them into lists!
                </p>
                <img src={ScrumBoard} className="board-page__new-image" alt="" />
                <button onClick={() => onBtnClick()} className="btn btn-brand-secondary rounded-pill">
                    New Board
                </button>
            </div>
        </div>
    );
};

export default BoardsEmptyPage;