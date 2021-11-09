import * as React from "react";

import "./ask-to-confirm-registration.scss";
import { Message } from "../../lib/message/message";
import { Page } from "../../lib/page/page";

export function AskToConfirmRegistrationPage(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
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
