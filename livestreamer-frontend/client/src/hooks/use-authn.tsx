import * as React from "react";

import { User, APIError } from "../types";
import { useIsMounted } from "./use-is-mounted";

export type UserState = User | null;
export type ErrorState = Error | APIError | null;

interface Context {
  user: UserState;
  setUser: (user: User | null) => void;
}

const AuthNContext = React.createContext<Context>({
  user: null,
  setUser: (user: User | null) => {},
});

function useAuthN(): Context {
  const isMounted = useIsMounted();
  const [user, setUser] = React.useState<UserState>(null);
  React.useEffect(() => {
    if (isMounted && user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else if (isMounted && user === null) {
      localStorage.removeItem("user");
    }
  }, [isMounted, user]);

  // When the page is reloaded, retrieve user from the local storage
  React.useEffect(() => {
    function getLoggedInUser() {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        const foundUser: User = JSON.parse(loggedInUser);
        setUser(foundUser);
      }
    }
    getLoggedInUser();
  }, []);

  return { user, setUser };
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
