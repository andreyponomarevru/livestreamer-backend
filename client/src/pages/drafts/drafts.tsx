import React, { ReactElement, Fragment, useState, useEffect } from "react";

import { ArchiveItem } from "../archive/archive-item/archive-item";
import { PageHeading } from "../../lib/page-heading/page-heading";
import { BroadcastResponse } from "../../types";
import { useFetch } from "../../hooks/useFetch";
import { API_ROOT_URL } from "../../config/env";
import { Loader } from "../../lib/loader/loader";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Page } from "../../lib/page/page";
import { Message } from "../../lib/message/message";

import "../../lib/items-list/items-list.scss";

export function PagesDrafts(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  function getDrafts() {
    fetchDrafts(`${API_ROOT_URL}/broadcasts/drafts`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
    });
  }

  const isMounted = useIsMounted();
  const [draftsResponse, fetchDrafts] = useFetch<BroadcastResponse>();

  useEffect(() => {
    if (isMounted) getDrafts();
  }, [isMounted]);

  return (
    <Page className="page_list">
      <PageHeading iconName="archive" name="Drafts" />

      {draftsResponse.isLoading && <Loader />}

      {draftsResponse.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {draftsResponse.response?.body && (
        <ul className="items-list">
          {draftsResponse.response.body.results.map((broadcast) => {
            return (
              <ArchiveItem
                key={broadcast.id}
                title={broadcast.title}
                likeCount={broadcast.likeCount}
                listenerPeakCount={broadcast.listenerPeakCount}
                date={new Date(broadcast.startAt).toLocaleDateString()}
              />
            );
          })}
        </ul>
      )}
    </Page>
  );
}
