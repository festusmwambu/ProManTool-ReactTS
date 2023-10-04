import { ReactNode } from "react";
import { Navigate, Route } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";
import { isLoggedSelector } from "../../features/session/sessionSlice";




interface ProtectedRouteProps {
    path: string;
    element: ReactNode // Accept the element prop of type ReactNode
}

const ProtectedRoute = ({ ...rest }: ProtectedRouteProps) => {
    const isLogged = useAppSelector(isLoggedSelector);

    const fetching = useAppSelector(state => state.root.session.fetching);
    
    return (
        <>
            {!fetching && (
                isLogged ? <Route {...rest} /> : <Navigate to="/auth?mode=login" />
            )}
        </>
    );
};

export default ProtectedRoute;