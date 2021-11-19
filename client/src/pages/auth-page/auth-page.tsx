import React, { ReactElement } from "react";

import { Page } from "../../lib/page/page";
import { AuthBox } from "./auth-box/auth-box";
import { useRedirectIfNotAuthenticated } from "../../hooks/use-redirect-if-not-authenticated";

function PagesAuth(): ReactElement {
  useRedirectIfNotAuthenticated();

  return (
    <Page className="page_box">
      <AuthBox />
    </Page>
  );
}

export { PagesAuth };
