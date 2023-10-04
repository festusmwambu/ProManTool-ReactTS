import { useState } from "react";
import { useForm } from "react-hook-form";
import ReCAPTCHA from 'react-google-recaptcha';

import { AuthAccPageProps } from "./auth_page";
import { RECAPTCHA_AVAILABLE, RECAPTCHA_SITE_KEY } from "../../config";
import "./auth_page.scss";



interface AuthFormPageProps {
    onSubmit: (data: AuthAccPageProps) => void;
    btnText: string;
}

const AuthFormPage = ({ onSubmit, btnText }: AuthFormPageProps) => {
    const [recaptchaStatus, setRecaptchaStatus] = useState(false);

    const { handleSubmit, register } = useForm<AuthAccPageProps>();
    
    return(
        <form onSubmit={handleSubmit((data) => {
            if (recaptchaStatus || !RECAPTCHA_AVAILABLE) {
                onSubmit(data as AuthAccPageProps);
            }
        })}
        >
            <div className="auth__modal-form-node">
                <input type="text" { ...register("username", { required: "Required" })} placeholder="Username" />
            </div>

            <div className="auth__modal-form-node">
                <input type="password" { ...register("password", { required: "Required" }) } placeholder="Password" />
            </div>

            {RECAPTCHA_AVAILABLE && (
                <ReCAPTCHA sitekey={RECAPTCHA_SITE_KEY} onChange={() => setRecaptchaStatus(true)} onExpired={() => setRecaptchaStatus(false)} />
            )}

            <div className="auth__mdal-form-node">
                <button type="submit" className="btn btn--block">{btnText}</button>
            </div>
        </form>
    );
};

export default AuthFormPage;
