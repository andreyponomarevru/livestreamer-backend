import * as React from "react";

import { PageHeading } from "../../lib/page-heading/page-heading";
import { AccountForm } from "./account-form/account-form";
import { useAuthN } from "../../hooks/use-authn";
import { API_ROOT_URL } from "../../config/env";
import { Message } from "../../lib/message/message";
import { Btn } from "../../lib/btn/btn";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Page } from "../../lib/page/page";
import { useFetch } from "../../hooks/use-fetch";
import { Loader } from "../../lib/loader/loader";

import "./account-page.scss";
import { useNavigate } from "react-router";
import { ROUTES } from "../../config/routes";

export function PagesAccount(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  function deleteAccount() {
    sendDeleteUserRequest(`${API_ROOT_URL}/user`, { method: "DELETE" });
  }

  const navigate = useNavigate();
  const auth = useAuthN();
  const isMounted = useIsMounted();
  const { state: deleteUserResponse, fetchNow: sendDeleteUserRequest } =
    useFetch();
  React.useEffect(() => {
    if (isMounted && deleteUserResponse.response) {
      auth.setUser(null);
      navigate(ROUTES.root);
    }
  }, [isMounted, deleteUserResponse]);

  return (
    <Page className="account-page">
      <PageHeading iconName="user" name="Account" />
      <AccountForm />
      <div className="account-page__btns">
        <Btn
          theme="red"
          className="account-page__delete-account-btn"
          handleClick={deleteAccount}
          name="Delete Account"
          isLoading={deleteUserResponse.isLoading}
        >
          <Loader for="btn" color="black" />
        </Btn>
        {deleteUserResponse.error && (
          <Message type="danger">{deleteUserResponse.error.message}</Message>
        )}
      </div>
    </Page>
  );
}
