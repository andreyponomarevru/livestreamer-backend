import React, { ReactElement } from "react";
import { useNavigate } from "react-router";

import { Page } from "../../lib/page/page";
import { AuthBox } from "./auth-box/auth-box";
import { useAuthN } from "../../hooks/use-authn";

export function PagesAuth(): ReactElement {
  const navigate = useNavigate();
  const { user } = useAuthN();

  React.useEffect(() => {
    if (user) navigate("/");
  });

  return (
    <Page className="page_box">
      <AuthBox />
    </Page>
  );
}
