import React, { ReactElement, Fragment } from "react";

import { PageHeading } from "../../components/lib/page-heading/page-heading";
import { AccountForm } from "../../components/account-form/account-form";

import "./account-page.scss";

export function PagesAccount(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  return (
    <main className="account-page">
      <PageHeading iconName="user" name="Account" />
      <AccountForm />
      <div className="account-page__btns">
        <button className="btn btn_theme_white">
          Send password-reset link
        </button>
        <button className="btn btn_theme_red">Delete Account</button>
        <button className="btn btn_theme_white">Log Out</button>
      </div>
    </main>
  );
}
