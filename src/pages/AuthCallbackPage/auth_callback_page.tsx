import { useEffect } from "react";
import { trackPageView } from "../../utils/ga_util";
import "./auth_callback_page.scss";



const AuthCallbackPage = () => {

    useEffect(() => {
        trackPageView("OAuth Callback Page");
        window.close();
    }, []);

    return (
        <div className="auth-callback">
            <p className="auth-callback__text">This window will be closed soonest.</p>
        </div>
    );
};

export default AuthCallbackPage;