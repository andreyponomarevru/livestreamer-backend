import React, { useEffect, ReactElement } from "react";

import { useNavigate } from "react-router-dom";
import { useAuthN } from "../../hooks/use-authn";
import { Page } from "../../lib/page/page";
import { ForgotPassBox } from "./forgot-pass-box/forgot-pass-box";
import { ROUTES } from "../../config/routes";

function ForgotPassPage(): ReactElement {
  const navigate = useNavigate();

  const auth = useAuthN();
  useEffect(() => {
    if (auth.user) navigate(ROUTES.root);
  });

  return (
    <Page className="page_box">
      <ForgotPassBox />
    </Page>
  );
}

export { ForgotPassPage };
