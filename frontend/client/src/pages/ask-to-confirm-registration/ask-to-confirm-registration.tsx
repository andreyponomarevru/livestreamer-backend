import * as React from "react";

import "./ask-to-confirm-registration.scss";

import { Page } from "../../lib/page/page";
import { useNavigate } from "react-router";
import { useAuthN } from "../../hooks/use-authn";
import { ROUTES } from "../../config/routes";

function AskToConfirmRegistrationPage(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const navigate = useNavigate();
  const auth = useAuthN();
  React.useEffect(() => {
    if (auth.user) navigate(ROUTES.root);
  }, []);

  return (
    <Page className="ask-to-confirm-registration-page page_box">
      <h1 className="ask-to-confirm-registration-page__heading">
        Almost done.
        <br />
        Check your mailbox
      </h1>

      <p className="confirm-registration-page__main">
        We have sent an email with a confirmation link to your email address. In
        order to complete the registration process, please click the
        confirmation link.
      </p>

      <p>
        If you do not receive a confirmation email, please check your spam
        folder.
      </p>
    </Page>
  );
}

export { AskToConfirmRegistrationPage };
