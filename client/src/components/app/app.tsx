import React, { ReactElement } from "react";
import {
  Redirect,
  Route,
  Switch,
  NavLink,
  BrowserRouter as Router,
} from "react-router-dom";

import axios from "axios";

import { ErrorBoundary } from "./../../components/error-boundary/error-boundary";
import { Ticker } from "../ticker/ticker";
import { StreamBar } from "../stream-bar/stream-bar";
import { NavBar } from "../nav-bar/nav-bar";

import { PagesChat } from "./../../pages/chat/chat";
import { PagesAccount } from "../../pages/account/account";
import { PagesArchive } from "../../pages/archive/archive";
import { PagesSignIn } from "../../pages/signin/signin";
import { PagesSchedule } from "../../pages/schedule/schedule";
import { PagesBookmarks } from "../../pages/bookmarks/bookmarks";
import { PagesPasswordReset } from "../../pages/password-reset/password-reset";

import "./app.scss";

const { REACT_APP_API_ROOT } = process.env;

export function App(): ReactElement {
  return (
    <div className="app">
      <ErrorBoundary>
        <header className={`app__header`}>
          <NavBar />
          <StreamBar />
          <Ticker />
        </header>
        {/* A <Switch> looks through its children <Route>s and
     renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/password-reset">
            <PagesPasswordReset className="app__main" />
          </Route>
          <Route path="/bookmarks">
            <PagesBookmarks className="app__main" />
          </Route>
          <Route path="/schedule">
            <PagesSchedule className="app__main" />
          </Route>
          <Route path="/archive">
            <PagesArchive className="app__main" />
          </Route>
          <Route path="/signin">
            <PagesSignIn className="app__main" />
          </Route>
          <Route path="/account">
            <PagesAccount className="app__main" />
          </Route>
          <Route path="/">
            <PagesChat className="app__main" />
          </Route>
        </Switch>
      </ErrorBoundary>
    </div>
  );
}
