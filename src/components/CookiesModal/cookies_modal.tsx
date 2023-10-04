import { useEffect } from "react";
import Cookies from "universal-cookie";
import Modal from "react-modal";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { RootState } from "../../app/store";
import { toggleCookiesModalSync } from "../../features/session/sessionSlice";
import "./cookies_modal.scss";



/******************************************************************************************************
 * Use `React-Redux` hooks to let React component interact with the Redux store. 
 * Read data from the `store` with `useSelector`, and dispatch actions using `useDispatch`. Infact, use pre-typed hooks `useAppSelector` and `useAppDispatch` defined in the `/src/app/hooks.ts` file.
 * Then import that component into `App.tsx` file with that component rendered inside of `App.tsx`.
********************************************************************************************************/
const cookies = new Cookies();

const customStyles = {
    content: {
        top: "50%",
        bottom: "auto",
        left: "50%",
        right: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        maxWidth: "700px",
        maxHeight: "100vh",
    },
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.75)",
    }
}

interface CookiesListProps {
    type: string;
    optional: boolean;
    checked: boolean;
    interactive: boolean;
    description: string;
}

// Define the Cookies Modal.
const CookiesModal = () => {
    // Create a dispatch function using `useAppDispatch` custom hook.
    const dispatch = useAppDispatch();

    // Get the `isCookiesModalOpen` state from the Redux `store` referenced on `rootReducer` using `useAppSelector` custom hook.
    // Infact, use the pre-typed hooks from the `hooks.ts` file which are `useAppSelector` and `useAppDispatch` instead of `useSelector` and `useDispatch` from `React-Redux`.
    const isCookiesModalOpen = useAppSelector((state: RootState) => state.root.session.cookiesModalVisible);

    const cookiesList: Record<string, CookiesListProps> = {
        hasSeenCookiesModal: {
            type: "boolean",
            optional: false,
            checked: false, // Add a default value for 'checked'
            interactive: false,
            description: "This cookie allows us to know if you have been already informed about what cookies we use.",
        },
        token: {
            type: "string",
            optional: false,
            checked: true, // Add a default value for 'checked'
            interactive: true,
            description: "It stores your session token, so you don't have to log in everytime you visit the webpage.",
        },
        allowAnalytics: {
            type: "boolean",
            optional: true,
            checked: JSON.parse(cookies.get("allowAnalytics") || "false"), // Use the default value here.
            interactive: true,
            description: "Pro-Man-Tool has google analytics implemented to learn how you interact with the application and learn from that, but it is optional, you can disable it if you like to ^^.",
        }
    };

    const toggleCookie = (cookie: string) => {
        cookiesList[cookie].checked = !cookiesList[cookie].checked;

        cookies.set(cookie, cookiesList[cookie].checked);
    };

    useEffect(() => {
        cookies.set("hasSeenCookiesModal", true);
    }, []);

    return (
        <Modal 
            isOpen={isCookiesModalOpen} // Use the state from `useAppSelector`
            style={customStyles} 
            onRequestClose={() => dispatch(toggleCookiesModalSync())} // Dispatch thunk middleware async action using `useAppDispatch`
        > 
            <div className="cookies-modal">
                <div className="cookies-modal__header">
                    <h5 className="cookies-modal__header-title">
                        {"<sarcasm>"}
                            <br />
                            <span style={{ marginLeft: 25 }}>Oh wow... cookies... in 2023... I didnt see that coming.</span>
                            <br />
                        {"</sarcasm>"}
                    </h5>
                </div>
                <hr />
                <div className="cookies-modal__body">
                    <p>Hello! before you get deep into the website, I'd like to inform you what cookies we use and for what reasons.</p>
                    {Object.keys(cookiesList).map((cookieName) => {
                        // Destructure an object property using a variable (`cookieName`) for the property name. Use square brackets to access the object property dynamically.
                        const { type, optional, checked, interactive, description } = cookiesList[cookieName];

                        return (
                            <div className="cookies-modal__body-cookie">
                                <div className="cookies-modal__body-cookie__description">
                                    <p>
                                        <strong>{cookieName}</strong> ({ type })
                                        <br />
                                        <small>Optional: { optional ? "Yes" : "No" }</small>
                                        <br />
                                        <small>Description: { description }</small>
                                    </p>
                                </div>
                                { interactive && (
                                    <div>
                                        <input id={cookieName} type="checkbox" onChange={() => toggleCookie(cookieName)} defaultChecked={checked} disabled={!optional} />
                                    </div>
                                )} 
                            </div>
                        );
                    })};

                    <small>* You can always come back to this modal and change your preferences.</small>
                </div>
                <div className="cookies-modal__footer">
                    <button className="btn" onClick={() => dispatch(toggleCookiesModalSync())}>Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default CookiesModal;