import { Dispatch, PayloadAction, createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";
import cogoToast from "cogo-toast";

import useAuthService, { Params } from "../../services/use_auth_service";
import useOAuthService from "../../services/use_oauth_service";
import { RootState } from "../../app/store";



const cookies = new Cookies();

export interface SessionSliceProps {
    fetching: boolean;
    token: string | undefined;
    user: {
        id: number | undefined;
        username: string;
    },
    cookiesModalVisible: boolean;
};

const defaultState: SessionSliceProps = {
    fetching: false,
    token: cookies.get("token") || undefined,
    user: {
        id: undefined,
        username: "",
    },
    cookiesModalVisible: cookies.get("hasSeenCookiesModal") ? false : true,
};

const sessionSlice = createSlice({
    name: "session",
    initialState: defaultState,
    reducers: {
        sessionFetchingSuccess: (state, action: PayloadAction<boolean>) => {
            state.fetching = action.payload;
        },

        sessionFetchingError: (state) => {
            // Handle failure, e.g. redirect to 404 page
            window.location.href = "/404";
            return state;
        },

        toggleCookiesModalSuccess: (state) => {
            state.cookiesModalVisible = !state.cookiesModalVisible;
        },
        
        logInSuccess: (state, action: PayloadAction<{ token: string; id: number; username: string }>) => {
            const { token, id, username } = action.payload;

            state.token = token;
            state.user.id = id;
            state.user.username = username;
            state.fetching = false;
            cookies.set("token", token);
        },

        signUpSuccess: (state, action: PayloadAction<{ token: string, id: number, username: string }>) => {
            const { token, id, username } = action.payload;

            state.token = token;
            state.user.id = id;
            state.user.username = username;
            state.fetching = false;
            cookies.set("token", token);
        },

        reconnectSuccess: (state, action: PayloadAction<{ token: string, id: number, username: string }>) => {
            state.token = action.payload.token;
            state.user.id = action.payload.id;
            state.user.username = action.payload.username;
            state.fetching = false; 
        },

        // Clear the token from the cookies and reset the session state.
        logOutSuccess: () => {
            cookies.remove("token");
            return defaultState;
        },
    },
});

// Export Redux `action creators` as named exports from this "slice" file for use in the Redux store setup.
export const { sessionFetchingSuccess, toggleCookiesModalSuccess, logInSuccess, signUpSuccess, reconnectSuccess, logOutSuccess } = sessionSlice.actions;



// Define `thunk middlewares` that allows to write `sync or async action creators` that return a function instead of an action.
// Rather than executing some logic now, `thunk middlewares` can be used to perform the work later.
// `Thunk middlewares` are a pattern of writing functions with logic inside them that can interact with a Redux store's `dispatch` and `getState` methods.
export const sessionFetchingSync = () => (dispatch: Dispatch) => {
    dispatch(sessionFetchingSuccess(true));
};

export const toggleCookiesModalSync = () => (dispatch: Dispatch) => {
    dispatch(toggleCookiesModalSuccess());
}

export const logInAsync = (username: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(sessionFetchingSuccess(true));
    
    const { authService } = useAuthService();

    try {
        const response = await authService("login", { username, password });
        
        const { data } = response;

        dispatch(logInSuccess(data));
    } catch(err: any) { // Add a type annotation to err.
        if (err.response) {
            const { data, status } = err.response;

            const message = `${status} ${data.msg}`;

            cogoToast.error(message, { position: "bottom-right" });
        } else {
            cogoToast.error("An error occurred during login", { position: "bottom-right" });
        }
    } finally {
        dispatch(sessionFetchingSuccess(false));
    }
};

export const signUpAsync = (username: string, password: string) => async (dispatch: Dispatch) => {
    dispatch(sessionFetchingSuccess(true));

    const { authService } = useAuthService();

    try {
        const response = await authService("signup", { username, password }); 

        const { data } = response;
        const { token } = data;
        cookies.set("token", token);

        dispatch(signUpSuccess(data));
    } catch (err: any) {
        const { data, status } = err.response;

        const message = `${status} ${data.msg}`;

        cogoToast.error(message, { position: "bottom-right" });

        dispatch(sessionFetchingSuccess(false));
    }
};

export const reconnectAsync = () => async (dispatch: Dispatch) => {
    dispatch(sessionFetchingSuccess(true));

    const { authService } = useAuthService();

    const defaultParams: Params = {
        username: "",
        password: "",
    };

    try {
        const response = await authService("reconnect", defaultParams);

        const { data } = response;

        dispatch(reconnectSuccess(data));
    } catch (err: any) {
        if (err.response) {
            const { data, status } = err.response;

            const message = `${status} ${data.msg}`;

            cogoToast.error(message, { position : "bottom-right" });
        } else {
            cogoToast.error("An error occurred during reconnection", { position : "bottom-right" });
        }
    } finally {
        dispatch(sessionFetchingSuccess(false));
    }
};

export const logoutSync = () => (dispatch: Dispatch) => {
    // Clear the token from cookies
    cookies.remove("token");

    // Dispatch the `logOutSuccess` event
    dispatch(logOutSuccess());

    // Return any data here, or just return undefined.
}

export const oAuthGithubServiceAsync = (code: string, state: string) => async (dispatch: Dispatch) => {
    dispatch(sessionFetchingSuccess(true));

    const { oAuthService } = useOAuthService();

    try {
        const response = await oAuthService({ code, state });

        const { data } = response;
        const { token } = data;
        cookies.set("token", token);

        dispatch(signUpSuccess(data));
    } catch (err) {
        dispatch(sessionFetchingSuccess(false));
    }
};


// Define `selectors` to access the session state from the `rootReducer`.
export const isLoggedSelector = (state: RootState): boolean => !!state.root.session.token;
export const isSessionFetching = (state: RootState): boolean => state.root.session.fetching;



// Export the slice reducer for use in the Redux store setup.
export default sessionSlice.reducer;