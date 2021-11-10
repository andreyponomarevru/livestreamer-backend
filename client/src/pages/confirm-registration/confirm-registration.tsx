import * as React from "react";
import { NavLink } from "react-router-dom";

import { useQuery } from "../../hooks/use-query";
import { Message } from "../../lib/message/message";
import { API_ROOT_URL } from "../../config/env";
import { Loader } from "../../lib/loader/loader";
import { Page } from "../../lib/page/page";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { useFetch } from "../../hooks/use-fetch";
import { Help } from "../../lib/help/help";

export function ConfirmRegistrationPage(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const query = useQuery();
  const token = query.get("token");

  const isMounted = useIsMounted();

  const [confirmSignUpResponse, sendToken] = useFetch();
  React.useEffect(() => {
    if (isMounted && token) {
      console.log("[confirmSignUp] Sending confirmation request...");

      sendToken(`${API_ROOT_URL}/verification?token=${token}`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      });
    }
  }, [isMounted, token]);

  const [isConfirmed, setIsConfirmed] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    if (isMounted && confirmSignUpResponse.response) {
      setIsConfirmed(true);
    } else if (isMounted && confirmSignUpResponse.error) {
      setIsConfirmed(false);
    }
  }, [isMounted, confirmSignUpResponse]);

  return (
    <Page className="page_box">
      {isConfirmed === false && (
        <React.Fragment>
          <Message type="danger">
            {`Sorry, we couldn't verify your email :(`}
          </Message>
          <Help />
        </React.Fragment>
      )}

      {isConfirmed === true && (
        <Message type="success">
          <div className="circle circle_green page__circle">
            Done! Now, you can <NavLink to="/signin">log in</NavLink>.
          </div>
        </Message>
      )}

      {confirmSignUpResponse.isLoading && <Loader />}
    </Page>
  );
}
