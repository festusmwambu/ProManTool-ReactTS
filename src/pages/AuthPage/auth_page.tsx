import { useEffect, useState } from "react";
import qs from "qs";
import { Navigate } from "react-router-dom";

import { trackPageView } from "../../utils/ga_util";
import Loading from "../../components/Loading/loading";
import AuthFormPage from "./auth_form_page";
import GitHubOAuth from "../../components/GitHubOAuth/github_oauth";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { isLoggedSelector, isSessionFetching, logInAsync, oAuthGithubServiceAsync, signUpAsync } from "../../features/session/sessionSlice";
import "./auth_page.scss";



export interface AuthAccPageProps {
    username: string;
    password: string;
}

interface AuthPageProps {
    location?: any;
}

const AuthPage = ({ location }: AuthPageProps) => {
    const [mode, setMode] = useState(true);

    const dispatch = useAppDispatch(); // Use useAppDispatch

    const isLogged = useAppSelector(isLoggedSelector);

    const fetching = useAppSelector(isSessionFetching)

    useEffect(() => {
        const queryParameters = qs.parse(location.search, { ignoreQueryPrefix: true });

        if (queryParameters.mode) {
            const preSelectedMode = queryParameters.mode === "login" ? true : false;

            setMode(preSelectedMode);
        }

        trackPageView("Auth");
    }, [location.search]);

    const handleLogin = ({ username, password }: AuthAccPageProps) => {
        dispatch(logInAsync(username, password));
    };

    const handleSignup = ({ username, password }: AuthAccPageProps) => {
        dispatch(signUpAsync(username, password));
    };

    const toggleMode = (event: any) => {
        event.preventDefault();
        setMode(!mode);
    };

    return (
        <>
            {isLogged && (
                <Navigate to="/boards" />
            )}

            <div className="auth">
                <div className="auth__modal">
                    <Loading display={fetching} />
                    <h1 className="auth__modal-title text-primary">Pro-Man-Tool</h1>
                    <div className="auth__modal-body">
                        {mode 
                            ? <AuthFormPage onSubmit={handleLogin} btnText="Login" />
                            : <AuthFormPage onSubmit={handleSignup} btnText="Signup" />
                        }
                    </div>

                    <div className="auth__modal-footer">
                        <GitHubOAuth 
                            text={mode ? "Login with GitHub" : "Signup with GitHub"} 
                            onSuccess={(code, state) => dispatch(oAuthGithubServiceAsync(code, state))}
                        />

                        <div className="auth__modal-footer__toggler">
                            <button onClick={toggleMode}>
                                {mode ? "I don't have an account" : "Already have an account"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AuthPage;