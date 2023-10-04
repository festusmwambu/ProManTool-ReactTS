import { v4 as uuidv4 } from "uuid";
import qs from "qs";

import { trackEvent } from "../../utils/ga_util";
import { OAUTH_GITHUB } from "../../config";
import "./github_oauth.scss";



interface GitHubOAuthProps {
    onSuccess(code: string, state: string): void;
    text?: string;
};

const GitHubOAuth = ({ onSuccess, text = "Auth with Github" }: GitHubOAuthProps) => {
    const openModal = () => {
        trackEvent({
            category: "OAUTH",
            action: "Opened GitHub OAuth Modal",
        });
    };

    const state = uuidv4();

    const url = `https://github.com/login/oauth/authorize?scope=user:email&state=${state}&client_id=${OAUTH_GITHUB.CLIENT_ID}`;

    const popup = window.open(url, "", "width=400, height=600, left=400, top=50");

    popup?.addEventListener("beforeunload", (event) => {
        const { code } = qs.parse(popup?.location.search, { ignoreQueryPrefix: true });

        if (code) {
            onSuccess(code as string, state);
        }
    });

    return (
        <div className="oauth-github" onClick={openModal}>
            <i className="oauth-github__icon fa fa-github" aria-hidden="true" />
            <p className="oauth-github__text">{text}</p>
        </div>
    );
};

export default GitHubOAuth;