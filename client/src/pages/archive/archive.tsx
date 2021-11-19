import * as React from "react";

import { ArchiveItem } from "./archive-item/archive-item";
import { PageHeading } from "../../lib/page-heading/page-heading";
import { BroadcastResponse } from "../../types";
import { useFetch } from "../../hooks/use-fetch";
import { API_ROOT_URL } from "../../config/env";
import { Loader } from "../../lib/loader/loader";
import { useIsMounted } from "../../hooks/use-is-mounted";
import { Message } from "../../lib/message/message";
import { Page } from "../../lib/page/page";

import "../../lib/items-list/items-list.scss";

function PagesArchive(
  props: React.HTMLAttributes<HTMLDivElement>
): React.ReactElement {
  const isMounted = useIsMounted();

  const { state: broadcasts, fetchNow: sendBroadcastsRequest } =
    useFetch<BroadcastResponse>();

  React.useEffect(() => {
    if (isMounted) {
      sendBroadcastsRequest(`${API_ROOT_URL}/broadcasts`);
    }
  }, [isMounted]);

  // TODO: Add 'Edit broadcast' feature
  function updateBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/${id}`; // PATCH
  }

  // TODO: Add 'Delete broadcast' feature
  function destroyBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/broadcasts/${id}`; // DELETE
  }

  //

  return (
    <Page className="page_list">
      <PageHeading iconName="archive" name="Archive" />

      {broadcasts.isLoading && <Loader for="page" color="pink" />}

      {broadcasts.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {broadcasts.response?.body && (
        <ul className="items-list">
          {broadcasts.response.body.results.map((broadcast) => {
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

export { PagesArchive };
