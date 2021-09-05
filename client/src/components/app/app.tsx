import React, { ReactElement, Fragment } from "react";
import {
  Redirect,
  Route,
  Switch,
  NavLink,
  BrowserRouter as Router,
} from "react-router-dom";

import axios from "axios";

import { ErrorBoundary } from "./../../components/error-boundary/error-boundary";
import ScrollToTop from "../../utils/scroll-to-top";
import { BasicLayout } from "../../layouts/basic-layout/basic-layout";

import { PagesChat } from "./../../pages/chat/chat";
import { PagesArchive } from "../../pages/archive/archive";
import { PagesSchedule } from "../../pages/schedule/schedule";
import { PagesBookmarks } from "../../pages/bookmarks/bookmarks";
import { PagesUsers } from "../../pages/users/users";
import { ForgotPasswordPage } from "../../pages/forgot-password/forgot-password";
import { PagesAccount } from "../../pages/account/account";
import { PagesAuth } from "../../pages/auth-page/auth-page";

const { REACT_APP_API_ROOT } = process.env;

export function App(): ReactElement {
  return (
    <Fragment>
      <ErrorBoundary>
        <ScrollToTop />
        {/* A <Switch> looks through its children <Route>s and
     renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/forgot-password">
            <BasicLayout>
              <ForgotPasswordPage />
            </BasicLayout>
          </Route>
          <Route path="/bookmarks">
            <BasicLayout>
              <PagesBookmarks />
            </BasicLayout>
          </Route>
          <Route path="/schedule">
            <BasicLayout>
              <PagesSchedule />
            </BasicLayout>
          </Route>
          <Route path="/signin">
            <BasicLayout>
              <PagesAuth />
            </BasicLayout>
          </Route>
          <Route path="/signup">
            <BasicLayout>
              <PagesAuth />
            </BasicLayout>
          </Route>
          <Route path="/archive">
            <BasicLayout>
              <PagesArchive />
            </BasicLayout>
          </Route>
          <Route path="/account">
            <BasicLayout>
              <PagesAccount />
            </BasicLayout>
          </Route>
          <Route path="/users">
            <BasicLayout>
              <PagesUsers />
            </BasicLayout>
          </Route>
          <Route path="/">
            <BasicLayout>
              <PagesChat />
            </BasicLayout>
          </Route>
        </Switch>
      </ErrorBoundary>
    </Fragment>
  );
}
