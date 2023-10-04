import { useEffect } from "react";
import { Link } from "react-router-dom";

import { trackPageView } from "../../utils/ga_util";
import "./error_404_page.scss";


const Error404Page = () => {
    useEffect(() => {
        trackPageView("404");
    }, []);

    return (
        <div className="error-page">
            <h1>404</h1>
            <p>Page not found.</p>
            <Link to="/boards">Go to boards</Link>
        </div>
    );
};

export default Error404Page;