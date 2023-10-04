//Packages
import Cookies from "universal-cookie"; // `universal-cookie`: This package is used for working with cookies in a universal (both client-side and server-side) way.
import ReactGA, { EventArgs } from "react-ga";  // `react-ga`: This package provides utilities for integrating Google Analytics with a React application.


/*
Integrate `Google Analytics tracking` into a `web application` while also respecting the user's preferences for analytics tracking.
*/

// Declarations
const cookies = new Cookies();  // Creates an instance of `Cookies` from the `universal-cookie` package, which allows you to work with cookies.

/* 
Track events and page views using Google Analytics in your React application. It includes logic to respect user preferences by checking a cookie named 'allowAnalytics'. 
If analytics tracking is allowed, it uses the react-ga library to send data to Google Analytics.
*/
export const trackEvent = (event: EventArgs) => {
    if (cookies.get("allowAnalytics")) {
        ReactGA.event(event);
    }
};

export const trackPageView = (pagePath: string) => {
    if (cookies.get("allowAnalytics")) {
        ReactGA.pageview(pagePath);
    }
};

