import React, { ReactElement } from "react";
import { useNavigate } from "react-router";

import { Page } from "../../lib/page/page";
import { AuthBox } from "./auth-box/auth-box";
import { useAuthN } from "../../hooks/use-authn";
import { useRedirectIfNotAuthenticated } from "../../hooks/use-redirect-if-not-authenticated";

export function PagesAuth(): ReactElement {
  useRedirectIfNotAuthenticated();

  return (
    <Page className="page_box">
      <AuthBox />
    </Page>
  );
}
