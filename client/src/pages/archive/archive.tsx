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

function PagesArchive(): React.ReactElement {
  const isMounted = useIsMounted();

  const { state: streams, fetchNow: sendGetStreamsRequest } =
    useFetch<BroadcastResponse>();

  React.useEffect(() => {
    if (isMounted) {
      sendGetStreamsRequest(`${API_ROOT_URL}/streams`);
    }
  }, [isMounted]);

  // TODO: Add 'Edit broadcast' feature
  function updateBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/streams/${id}`; // PATCH
  }

  // TODO: Add 'Delete broadcast' feature
  function destroyBroadcast(id: number) {
    const URL = `${API_ROOT_URL}/streams/${id}`; // DELETE
  }

  //

  return (
    <Page className="page_list">
      <PageHeading iconName="archive" name="Archive" />

      {streams.isLoading && <Loader for="page" color="pink" />}

      {streams.error && (
        <Message type="danger">Something went wrong :(</Message>
      )}

      {streams.response?.body && (
        <ul className="items-list">
          {streams.response.body.results.map((broadcast) => {
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
