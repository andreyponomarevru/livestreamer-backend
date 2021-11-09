import React, { ReactElement, useContext } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  HashRouter,
} from "react-router-dom";

import { ErrorBoundary } from "../lib/error-boundary/error-boundary";
//import ScrollToTop from "../../utils/scroll-to-top";
import { PagesChat } from "../pages/chat/chat";
import { PagesArchive } from "../pages/archive/archive";
import { PagesSchedule } from "../pages/schedule/schedule";
import { PagesBookmarks } from "../pages/bookmarks/bookmarks";
import { PagesUsers } from "../pages/users/users";
import { ForgotPassPage } from "../pages/forgot-pass/forgot-pass";
import { PagesAccount } from "../pages/account-page/account-page";
import { PagesAuth } from "../pages/auth-page/auth-page";
import { ProtectedRoute } from "../lib/protected-route/protected-route";
import { useAuthN, AuthNProvider } from "../hooks/use-authn";
import { NavBar } from "../lib/nav-bar/nav-bar";
import { StreamBar } from "../lib/stream-bar/stream-bar";
import { PassResetPage } from "../pages/pass-reset/pass-reset";
import { AskToConfirmRegistrationPage } from "../pages/ask-to-confirm-registration/ask-to-confirm-registration";
import { ConfirmRegistrationPage } from "../pages/confirm-registration/confirm-registration";
import { PagesDrafts } from "../pages/drafts/drafts";
import { WebSocketContext } from "../ws-client";
import { useWSStreamState } from "../hooks/use-ws-stream-state";

import "./app.scss";

type Credentials = {
  password: string;
  username?: string;
  email?: string;
};

export function App(): ReactElement {
  const { user, updateUser, err, setErr, signin, signout } = useAuthN();

  return (
    <HashRouter>
      <ErrorBoundary>
        <AuthNProvider>
          {/*<ScrollToTop />*/}

          <header className="app__header">
            <NavBar />
            <StreamBar />
          </header>
          <main className="app__main">
            <Routes>
              <Route
                path="/confirmation-required"
                element={<AskToConfirmRegistrationPage />}
              />
              <Route path="/password-reset" element={<PassResetPage />} />
              <Route path="/forgot-pass" element={<ForgotPassPage />} />
              <Route
                path="/confirm-signup"
                element={<ConfirmRegistrationPage />}
              />
              <Route path="/schedule" element={<PagesSchedule />} />
              <Route path="/archive" element={<PagesArchive />} />
              <Route path="/signin" element={<PagesAuth />} />
              <Route path="/register" element={<PagesAuth />} />
              <Route path="/drafts" element={<PagesDrafts />} />
              <Route path="/account" element={<PagesAccount />} />
              <Route path="/users" element={<PagesUsers />} />
              <Route path="/" element={<PagesChat />} />
            </Routes>
          </main>
        </AuthNProvider>
      </ErrorBoundary>
    </HashRouter>
  );
}
/*
Protected routes
        
<ProtectedRoute
  path="/drafts"
  component={PagesDrafts}
  isLoggedIn={user ? true : false}
  hasPermission={user?.permissions["broadcast_draft"]?.includes(
    "read"
  )}
/>
<ProtectedRoute
  path="/account"
  component={PagesAccount}
  hasPermission={true}
/>
<ProtectedRoute
  exact
  path="/users"
  component={PagesUsers}
  hasPermission={user?.permissions["all_user_accounts"]?.includes(
    "read"
  )}
/>

*/
