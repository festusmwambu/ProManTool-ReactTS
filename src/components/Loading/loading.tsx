import cn from "classnames";

import Spinner from "../../assets/images/spinner.svg";



interface LoadingProps {
    display?: boolean;
};

const Loading = ({ display }: LoadingProps) => {
    return (
        <div className={cn("loading", { "loading--hidden": !display })}>
            <img src={Spinner} alt="" />
        </div>
    );
};

export default Loading;