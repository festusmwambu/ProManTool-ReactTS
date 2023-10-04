import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import CookiesModal from "../components/CookiesModal/cookies_modal";
import Loading from "../components/Loading/loading";
import LandingPage from "../pages/LandingPage/landing_page";
import AuthCallbackPage from "../pages/AuthCallbackPage/auth_callback_page";
import AuthPage from "../pages/AuthPage/auth_page";
import Navbar from "../components/Navbar/navbar";
import ProtectedRoute from "../components/Utils/protected_route";
import BoardPage from "../pages/BoardPage/board_page";
import BoardsPage from "../pages/BoardsPage/boards_page";
import { useAppSelector } from "../app/hooks";



const AppRouter = () => {
    const cookiesModalVisible = useAppSelector(state => state.root.session.cookiesModalVisible);
    
    return (
        <>
            <BrowserRouter>
                {cookiesModalVisible && (
                    <CookiesModal />
                )}
                <Suspense fallback={<Loading display />}>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/home" element={<LandingPage />} />
                        <Route path="/auth/callback" element={<AuthCallbackPage />} />
                        <Route path="/auth" element={<AuthPage />} />

                        <>
                            <Navbar />
                            <ProtectedRoute path="/board/:id" element={<BoardPage />} />
                            <ProtectedRoute path="/boards" element={<BoardsPage />} />
                        </>
                    </Routes>
                </Suspense>
            </BrowserRouter>
        </>
    );
};

export default AppRouter;