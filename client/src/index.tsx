import React from "react";
import { HashRouter } from "react-router-dom";

import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";
import { App } from "./components/app/app";

// Global styles
import "./reset.scss";
import "./pages/page.scss";

const rootEl = document.getElementById("root");

// TODO: replace HashRouter with BrowserRouter (https://reactrouter.com/web/guides/primary-components): keep everything as is, just just the router name in JSX tag. Than on Stackoverflow there is example of Nginx config that BrowserRouter needs to work correctly
ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  rootEl
);

export default hot(App);
