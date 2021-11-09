import React, { ReactElement, useEffect } from "react";

import { PageHeading } from "../../lib/page-heading/page-heading";
import { UserMeta } from "./user-meta/user-meta";
import { useFetch } from "../../../hooks/use-fetch";
import { API_ROOT_URL } from "../../../config/env";
import { UsersResponse } from "../../../types";
import { Loader } from "../../lib/loader/loader";
import { useIsMounted } from "../../../hooks/use-is-mounted";
import { Message } from "../../lib/message/message";
import { Page } from "../../lib/page/page";

export function PagesUsers(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const isMounted = useIsMounted();
  const [users, fetchUsersNow] = useFetch<UsersResponse>();

  useEffect(() => {
    if (isMounted) {
      fetchUsersNow(`${API_ROOT_URL}/admin/users`, {
        method: "get",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      });
    }
  }, [isMounted]);

  return (
    <Page>
      <PageHeading iconName="users" name="Users" />

      {users.isLoading && <Loader />}

      {users.error && <Message type="danger">Something went wrong :(</Message>}

      {users.response?.body &&
        users.response.body.results.map((user) => {
          return (
            <UserMeta
              email={user.email}
              username={user.username}
              id={user.id}
              permissions={user.permissions}
              key={user.id}
            />
          );
        })}
    </Page>
  );
}
