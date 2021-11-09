import * as React from "react";
import { useNavigate } from "react-router";

import { useAuthN } from "./use-authn";

function useRedirectIfNotAuthenticated() {
  const navigate = useNavigate();
  const { user } = useAuthN();

  React.useEffect(() => {
    if (user) navigate("/");
  });
}

export { useRedirectIfNotAuthenticated };
