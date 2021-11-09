import React, { useEffect, ReactElement } from "react";

import { useNavigate } from "react-router-dom";
import { useAuthN } from "../../hooks/use-authn";
import { Page } from "../../lib/page/page";
import { ForgotPassBox } from "./forgot-pass-box/forgot-pass-box";

export function ForgotPassPage(): ReactElement {
  const navigate = useNavigate();

  const auth = useAuthN();
  useEffect(() => {
    if (auth.user) navigate("/");
  });

  return (
    <Page className="page_box">
      <ForgotPassBox />
    </Page>
  );
}
