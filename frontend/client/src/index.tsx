import * as React from "react";
import ReactDOM from "react-dom";

import { App } from "./app/app";
import { WebSocketProvider } from "./ws-client";

// Global styles
import "./reset.scss";
import "./layout.scss";

// TODO: replace HashRouter with BrowserRouter (https://reactrouter.com/web/guides/primary-components): keep everything as is, just just the router name in JSX tag. Than on Stackoverflow there is example of Nginx config that BrowserRouter needs to work correctly
ReactDOM.render(
  <WebSocketProvider>
    <App />
  </WebSocketProvider>,
  document.getElementById("root")
);
