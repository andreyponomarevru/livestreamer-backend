import React, { ReactElement, Fragment, useContext, useEffect } from "react";

import { NoBookmarksMsg } from "./no-bookmarks-msg/no-bookmarks-msg";
import { PageHeading } from "../../lib/page-heading/page-heading";

import { ArchiveItem } from "../archive/archive-item/archive-item";
import { useFetch } from "../../hooks/use-fetch";
import { API_ROOT_URL } from "../../config/env";
import { BroadcastResponse } from "../../types";
import { Loader } from "../../lib/loader/loader";

export function PagesBookmarks(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  return <div></div>;
  /*
  const { state: broadcastResponse, sendBookmarksRequest} = useFetch<BroadcastResponse>({
    url: `${API_ROOT_URL}/user/broadcasts/bookmarked`,
    options: {
      method: "get",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
    },
  });

  let broadcasts;
  if (api.response) {
    broadcasts = api.response.results.map((broadcast) => {
      return (
        <ArchiveItem
          key={broadcast.id}
          title={broadcast.title}
          likeCount={broadcast.likeCount}
          listenerPeakCount={broadcast.listenerPeakCount}
          isBookmarked={true}
          date={new Date(broadcast.startAt).toLocaleDateString()}
        />
      );
    });
    return (
      <div className="bookmarks-page">
        <PageHeading iconName="bookmark-selected" name="Bookmarks" />
        {broadcasts.length === 0 ? <NoBookmarksMsg /> : broadcasts}
      </div>
    );
  } else if (api.isLoading) {
    return (
      <div className="bookmarks-page">
        <PageHeading iconName="bookmark-selected" name="Bookmarks" />
        <Loader />
      </div>
    );
  } else {
    console.log(api);
    return (
      <div className="bookmarks-page">
        <PageHeading iconName="bookmark-selected" name="Bookmarks" />
        Something went wrong
      </div>
    );
  }*/
}
