import * as React from "react";

import { API_ROOT_URL } from "../config/env";
import { useFetch } from "./use-fetch";
import { useAuthN } from "./use-authn";
import { useIsMounted } from "./use-is-mounted";
import { State as UseFetchState } from "./use-fetch";

// TODO
// user doesn't get deleted from localStorage on Sign Out

function useSignOut(): {
  signOut: () => void;
  signOutResponse: UseFetchState<undefined>;
} {
  function signOut() {
    console.log("[useSignOut] Sending Sign Out Request");

    sendSignOutRequest(`${API_ROOT_URL}/sessions`, { method: "delete" });
  }

  const { setUser } = useAuthN();
  const isMounted = useIsMounted();
  const { state: signOutResponse, fetchNow: sendSignOutRequest } =
    useFetch<undefined>();
  React.useEffect(() => {
    setUser(null);
  }, [signOutResponse]);

  return { signOut, signOutResponse };
}

export { useSignOut };
