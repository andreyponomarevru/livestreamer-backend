import React, { ReactElement, Fragment } from "react";

import { PageHeading } from "../../components/lib/page-heading/page-heading";
import { UserMeta } from "../../components/user-meta/user-meta";

export function PagesUsers(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  return (
    <main className="users-page">
      <PageHeading iconName="users" name="Users" />
      <UserMeta />
      <UserMeta />
      <UserMeta />
      <UserMeta />
      <UserMeta />
      <UserMeta />
      <UserMeta />
      <UserMeta />
    </main>
  );
}
