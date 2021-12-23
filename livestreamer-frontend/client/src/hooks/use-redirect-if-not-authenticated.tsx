import * as React from "react";
import { useNavigate } from "react-router";

import { useAuthN } from "./use-authn";
import { ROUTES } from "../config/routes";

function useRedirectIfNotAuthenticated(): void {
  const navigate = useNavigate();
  const { user } = useAuthN();

  React.useEffect(() => {
    if (user) navigate(ROUTES.root);
  });
}

export { useRedirectIfNotAuthenticated };
