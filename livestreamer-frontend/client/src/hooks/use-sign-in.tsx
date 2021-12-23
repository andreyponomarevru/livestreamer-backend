import * as React from "react";

import { API_ROOT_URL } from "../config/env";
import { useAuthN } from "./use-authn";
import { useIsMounted } from "./use-is-mounted";
import { useFetch, State } from "./use-fetch";
import { Credentials, UserResponse } from "../types";

function useSignIn(): {
  signIn: (credentials: Credentials) => void;
  signInResponse: State<UserResponse>;
} {
  function signIn(credentials: Credentials) {
    console.log("[useSignIn] Sending Sign In Request");

    sendSignInRequest(`${API_ROOT_URL}/sessions`, {
      method: "post",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(credentials),
    });
  }

  const { setUser } = useAuthN();
  const isMounted = useIsMounted();
  const { state: signInResponse, fetchNow: sendSignInRequest } =
    useFetch<UserResponse>();

  React.useEffect(() => {
    if (isMounted && signInResponse.response?.body) {
      const user = signInResponse.response.body.results;
      setUser(user);
    }
  }, [isMounted, signInResponse]);

  return { signIn, signInResponse };
}

export { useSignIn };
