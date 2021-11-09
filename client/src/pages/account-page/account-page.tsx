import React, { ReactElement, useEffect, useState } from "react";

import { PageHeading } from "../../lib/page-heading/page-heading";
import { AccountForm } from "./account-form/account-form";
import { useAuthN } from "../../hooks/use-authn";
import { API_ROOT_URL } from "../../config/env";
import { useNavigate } from "react-router-dom";
import { parseResponse } from "../../utils/parse-response";
import { Message } from "../../lib/message/message";
import { Btn } from "../../lib/btn/btn";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Page } from "../../lib/page/page";

import "./account-page.scss";

export function PagesAccount(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  function deleteAccount() {
    setIsloading(true);
    const request: RequestInit = { method: "DELETE" };

    /*
    fetch(`${API_ROOT_URL}/user`, request)
      .then(parseResponse)
      .then(() => {
        setSuccessResponse(true);
        setIsloading(false);
      })
      .catch(() => setSuccessResponse(false));*/
    //setTimeout(() => setSuccessResponse(true), 2000);
    //setTimeout(() => )
  }

  const [successResponse, setSuccessResponse] = useState<boolean>();
  const [isLoading, setIsloading] = useState<boolean>(false);

  const history = useNavigate();
  const auth = useAuthN();
  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted && successResponse) auth.updateUser(null);
  }, [successResponse]);

  return (
    <Page className="account-page">
      <PageHeading iconName="user" name="Account" />
      <AccountForm />
      <div className="account-page__btns">
        {/*<button className="btn btn_theme_white">
          Send password-reset link
         </button>*/}
        <Btn
          theme="red"
          type="button"
          className="account-page__delete-account-btn"
          handleClick={deleteAccount}
          defaultText="Delete Account"
          isLoading={isLoading}
        />
        {successResponse === false && (
          <Message type="danger">Sorry, something went wrong :(</Message>
        )}
      </div>
    </Page>
  );
}
