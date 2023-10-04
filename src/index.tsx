import Cookies from "universal-cookie";
import ReactDOM from "react-dom";
import ReactGA from 'react-ga';
import { Provider } from "react-redux";

import { store } from "./app/store";
import { GOOGLE_ANALYTICS_ID } from "./config";
import { reconnectAsync } from "./features/session/sessionSlice";
import AppRouter from "./routes/AppRouter";
import "./App.scss";




const cookies = new Cookies();

ReactGA.initialize(GOOGLE_ANALYTICS_ID);

if (cookies.get("token")) {
    store.dispatch(reconnectAsync())
}

if (!cookies.get("allowAnalytics")) {
    cookies.set("allowAnalytics", true);
}

ReactDOM.render(
    <Provider store={store}>
      <AppRouter />
    </Provider>,
    document.getElementById("root")
);