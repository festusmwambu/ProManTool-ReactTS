import { NavLink } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logoutSync, toggleCookiesModalSync } from "../../features/session/sessionSlice";
import "./navbar.scss";



const Navbar = () => {
    const dispatch = useAppDispatch(); // Use useAppDispatch to dispatch actions from thunk middlewares

    const isCookiesModalVisible = useAppSelector(state => state.root.session.cookiesModalVisible); // Use useAppSelector to access the state

    // const handleManageCookiesAnchor = (event: MouseEvent<HTMLAnchorElement>) => {
    //     event.preventDefault();
    //     dispatch(toggleCookiesModalSync()); // Dispatch toggleCookiesModalSync
    // };

    const handleManageCookiesButton = () => {
        dispatch(toggleCookiesModalSync()); // Dispatch toggleCookiesModalSync
    }

    const handleLogoutButton = () => {
        dispatch(logoutSync()); // Dispatch logoutSync
    };

    return (
        <div className="navigation">
            <button onClick={handleManageCookiesButton} className="navigation__link">
                Manage cookies {isCookiesModalVisible ? "Visible" : "Hidden"} {/* Show cookies modal state */}
            </button>
            <NavLink to={"/boards"} className="navigation__link">
                Boards
            </NavLink>
            <button onClick={handleLogoutButton} className="navigation__link">
                Log out
            </button>
        </div>
    );
};

export default Navbar;