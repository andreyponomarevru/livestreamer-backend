import * as React from "react";

import { ArchiveItem } from "../archive/archive-item/archive-item";
import { PageHeading } from "../../lib/page-heading/page-heading";
import { BroadcastResponse } from "../../types";
import { useFetch } from "../../hooks/use-fetch";
import { API_ROOT_URL } from "../../config/env";
import { Loader } from "../../lib/loader/loader";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Page } from "../../lib/page/page";
import { Message } from "../../lib/message/message";

import "../../lib/items-list/items-list.scss";

function PagesDrafts(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const isMounted = useIsMounted();
  const { state: draftsResponse, fetchNow: sendGetDraftsRequest } =
    useFetch<BroadcastResponse>();

  React.useEffect(() => {
    if (isMounted) {
      sendGetDraftsRequest(`${API_ROOT_URL}/broadcasts/drafts`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      });
    }
  }, [isMounted]);

  //  TODO: Add new features using these endpoints
  function getAllBroadcastDrafts() {
    const URL = `${API_ROOT_URL}/broadcasts/drafts`; // GET
  }
  function updateBroadcastDraft(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/drafts/${id}`; // PATCH
  }
  function destroyBroadcastDraft(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/drafts/${id}`; // DELETE
  }

  //

  return (
    <Page className="page_list">
      <PageHeading iconName="archive" name="Drafts" />

      {draftsResponse.isLoading && <Loader for="page" color="pink" />}

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

export { PagesDrafts };
