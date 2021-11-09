import * as React from "react";

import { User, APIError, UserResponse } from "../types";
import { API_ROOT_URL } from "../config/env";
import { useIsMounted } from "./use-is-mounted";
import { useFetch } from "./use-fetch";

export type UserState = User | null;
export type ErrorState = Error | APIError | null;

type Credentials = { password: string; username?: string; email?: string };

interface Context {
  err: ErrorState;
  user: UserState;
  setErr: (err: ErrorState) => void;
  signin: (credentials: Credentials) => void;
  signout: () => void;
  updateUser: (user: UserState) => void;
}

const AuthNContext = React.createContext<Context>({
  err: null,
  user: null,
  setErr: (err: ErrorState) => {},
  signin: (credentials: Credentials) => {},
  signout: () => {},
  updateUser: (user: UserState) => {},
});

function useAuthN(): Context {
  console.log("[useAuthN]");

  function signin(credentials: Credentials) {
    console.log("[useAuthN] Sending Sign In Request");

    signinNow(`${API_ROOT_URL}/sessions`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });
  }

  function signout() {
    console.log("[useAuthN] Sending Sign Out Request");

    signOutNow(`${API_ROOT_URL}/sessions`, { method: "delete" });
  }

  const isMounted = useIsMounted();

  const [signinResponse, signinNow] = useFetch<UserResponse>();
  React.useEffect(() => {
    const responseBody = signinResponse.response?.body;

    console.log("[useAuthN] Sign In Response:", responseBody);

    if (isMounted && responseBody) {
      const user = responseBody.results;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
    } else if (isMounted && signinResponse.error) {
      setErr(signinResponse.error);
    }
  }, [isMounted, signinResponse]);

  const [signoutResponse, signOutNow] = useFetch<undefined>();
  React.useEffect(() => {
    console.log("[useAuthN] Sign Out Response:", signoutResponse);
    if (isMounted && signoutResponse.response) {
      setUser(null);
      localStorage.removeItem("user");
    }
  }, [isMounted, signoutResponse]);

  const updateUser = React.useCallback((user: User | null) => {
    setUser(user);
    if (user === null) {
      localStorage.removeItem("user");
    }
  }, []);

  const [user, setUser] = React.useState<UserState>(null);
  const [err, setErr] = React.useState<ErrorState>(null);

  // When the page is reloaded, retrieve user from the locale storage
  React.useEffect(() => {
    function getLoggedInUser() {
      const loggedInUser = localStorage.getItem("user");
      if (isMounted && loggedInUser) {
        const foundUser: User = JSON.parse(loggedInUser);
        setUser(foundUser);
      }
    }

    getLoggedInUser();
  }, [isMounted]);

  return { user, updateUser, err, setErr, signin, signout };
}

function AuthNProvider({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const authn = useAuthN();

  return (
    <AuthNContext.Provider value={authn}>{children}</AuthNContext.Provider>
  );
}

function AuthNConsumer(): Context {
  return React.useContext(AuthNContext);
}

export { AuthNProvider, AuthNConsumer as useAuthN };
