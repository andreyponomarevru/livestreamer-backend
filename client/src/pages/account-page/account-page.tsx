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
import { useFetch } from "../../hooks/use-fetch";
import { Loader } from "../../lib/loader/loader";

import "./account-page.scss";

export function PagesAccount(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  function deleteAccount() {
    sendDeleteUserRequest(`${API_ROOT_URL}/user`, { method: "DELETE" });
  }

  const auth = useAuthN();
  const isMounted = useIsMounted();
  const [deleteUserResponse, sendDeleteUserRequest] = useFetch();
  React.useEffect(() => {
    if (isMounted && deleteUserResponse.response) {
      auth.updateUser(null);
    }
  }, [isMounted, deleteUserResponse]);

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
          className="account-page__delete-account-btn"
          handleClick={deleteAccount}
          name="Delete Account"
          isLoading={deleteUserResponse.isLoading}
        >
          <Loader className="loader_black btn__loader" />
        </Btn>
        {deleteUserResponse.error && (
          <Message type="danger">Sorry, something went wrong :(</Message>
        )}
      </div>
    </Page>
  );
}
