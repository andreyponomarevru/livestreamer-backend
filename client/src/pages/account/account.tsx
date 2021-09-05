import React, { ReactElement, Fragment } from "react";

import { PageHeading } from "../../components/lib/page-heading/page-heading";
import { AccountForm } from "../../components/account-form/account-form";

export function PagesAccount(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  return (
    <main className="account-page">
      <PageHeading iconName="user" name="Account" />
      <AccountForm />
    </main>
  );
}
