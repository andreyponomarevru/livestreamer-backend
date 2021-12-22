import React, { ReactElement } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  HashRouter,
} from "react-router-dom";

import { ErrorBoundary } from "../lib/error-boundary/error-boundary";
import { PagesChat } from "../pages/chat/chat";
import { PagesArchive } from "../pages/archive/archive";
import { PagesSchedule } from "../pages/schedule/schedule";
// TODO: implement Bookmarks page
// import { PagesBookmarks } from "../pages/bookmarks/bookmarks";
import { PagesUsers } from "../pages/users/users";
import { ForgotPassPage } from "../pages/forgot-pass/forgot-pass";
import { PagesAccount } from "../pages/account-page/account-page";
import { PagesAuth } from "../pages/auth-page/auth-page";
import { ProtectedRoute } from "../lib/protected-route/protected-route";
import { AuthNProvider } from "../hooks/use-authn";
import { NavBar } from "../lib/nav-bar/nav-bar";
import { StreamBar } from "../lib/stream-bar/stream-bar";
import { PassResetPage } from "../pages/pass-reset/pass-reset";
import { AskToConfirmRegistrationPage } from "../pages/ask-to-confirm-registration/ask-to-confirm-registration";
import { ConfirmRegistrationPage } from "../pages/confirm-registration/confirm-registration";
import { PagesDrafts } from "../pages/drafts/drafts";
import { ROUTES } from "../config/routes";
import { StreamLikeCountProvider } from "../hooks/use-stream-like-count";
import { useStreamStateWSEvent } from "../hooks/websocket/use-stream-state-ws-event";

import "./app.scss";

function App(): ReactElement {
  const streamState = useStreamStateWSEvent();

  return (
    <HashRouter>
      <ErrorBoundary>
        <StreamLikeCountProvider>
          <AuthNProvider>
            <header className="app__header">
              <NavBar />
              <StreamBar streamState={streamState} />
            </header>
            <main className="app__main">
              <Routes>
                <Route
                  path={ROUTES.confirmationRequired}
                  element={<AskToConfirmRegistrationPage />}
                />
                <Route
                  path={ROUTES.passwordReset}
                  element={<PassResetPage />}
                />
                <Route
                  path={ROUTES.forgotPassword}
                  element={<ForgotPassPage />}
                />
                <Route
                  path={ROUTES.confirmRegistration}
                  element={<ConfirmRegistrationPage />}
                />
                <Route path={ROUTES.schedule} element={<PagesSchedule />} />
                <Route path={ROUTES.archive} element={<PagesArchive />} />
                <Route path={ROUTES.signIn} element={<PagesAuth />} />
                <Route path={ROUTES.register} element={<PagesAuth />} />
                <Route
                  path={ROUTES.drafts}
                  element={
                    <ProtectedRoute
                      checkPermission={{
                        resource: "broadcast_draft",
                        action: "read",
                      }}
                    >
                      <PagesDrafts />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.account}
                  element={
                    <ProtectedRoute>
                      <PagesAccount />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.users}
                  element={
                    <ProtectedRoute
                      checkPermission={{
                        resource: "all_user_accounts",
                        action: "read",
                      }}
                    >
                      <PagesUsers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path={ROUTES.root}
                  element={<PagesChat isStreamOnline={streamState.isOnline} />}
                />
              </Routes>
            </main>
          </AuthNProvider>
        </StreamLikeCountProvider>
      </ErrorBoundary>
    </HashRouter>
  );
}

export { App };
