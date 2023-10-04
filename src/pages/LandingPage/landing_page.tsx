import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { trackPageView } from "../../utils/ga_util";
import LandingImage from '../../assets/images/list-landing.jpg';
import "./landing_page.scss";



const LandingPage = () => {
    const [titleLabel, setTitleLabel] = useState("Projects");

    useEffect(() => {
        const changeTextInternal = setInterval(() => {
            const options = ["Projects", "Ideas", "Team", "Days"];

            const random = Math.floor(Math.random() * options.length);

            setTitleLabel(options[random]);
        }, 2000);

        trackPageView("Landing Page")

        return () => {
            clearInterval(changeTextInternal);
        };
    }, []);

    return (
        <div className="landing">
            <div className="landing__nav">
                <h1 className="landing__nav-logo">
                    Pro-Man-Tool
                </h1>
                <div>
                    <Link to="/auth?mode=signup">
                        <button className="btn btn-primary">
                            Sign up
                        </button>
                    </Link>
                    <Link to="/auth?mode=login" className="landing__nav-login">
                        Log in
                    </Link>
                </div>
            </div>

            <div className="landing__body">
                <div className="landing__body-left">
                    <h1 className="landing__body-title">
                        Organize your <span className="landing__body-label">{titleLabel}</span>
                        <br />
                        with Pro-Man-Tool
                    </h1>

                    <p className="landing__body-description">
                        Open source project management tool inspired by the Kanban Methodology.
                    </p>

                    <div className="landing__body-btns">
                        <div>
                            <Link to="/auth?mode=signup">
                                <button className="btn btn-primary">
                                    Start now
                                </button>
                            </Link>
                        </div>

                        <div>
                            <a href="https://github.com/festusmwambu/Pro-Man-Tool" target="_blank" rel="noreferrer">
                                <button className="btn btn-primary">
                                    <i className="fab fa-github" />
                                    GitHub Repository
                                </button>
                            </a>
                        </div>
                    </div>
                </div>

                <img src={LandingImage} className="landing__body-image" alt="" />
            </div>
        </div>
    );
};

export default LandingPage;