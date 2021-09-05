import React, { ReactElement, Fragment } from "react";

import { EmptyBookmarksMsg } from "../../components/empty-bookmarks-msg/empty-bookmarks-msg";
import { PageHeading } from "../../components/lib/page-heading/page-heading";

import { ArchiveItem } from "../../components/archive-item/archive-item";

const meta = {
  timestamp: "2312013",
  title: "Test Stream",
  description:
    "Some short detxt description of this show that should not exceed 255 characters it'l like a smal tweet, just put soming here and that's it",
  heartsCount: 3,
  peakListenersCOunt: 8,
  bookmarked: false,
};
const apiResponse = [];

export function PagesBookmarks(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  let archiveItems;
  if (apiResponse.length === 0) {
    archiveItems = <EmptyBookmarksMsg />;
  } else {
    archiveItems = (
      <Fragment>
        <ArchiveItem
          title={meta.title}
          heartsCount={meta.heartsCount}
          peakListenersCount={meta.peakListenersCOunt}
          description={meta.description}
          bookmarked={true}
          timestamp={meta.timestamp}
        />
        <ArchiveItem
          title={meta.title}
          heartsCount={meta.heartsCount}
          peakListenersCount={meta.peakListenersCOunt}
          description={meta.description}
          bookmarked={true}
          timestamp={meta.timestamp}
        />
        <ArchiveItem
          title={meta.title}
          heartsCount={meta.heartsCount}
          peakListenersCount={meta.peakListenersCOunt}
          description={meta.description}
          bookmarked={true}
          timestamp={meta.timestamp}
        />
      </Fragment>
    );
  }

  return (
    <main className="bookmarks-page">
      <PageHeading iconName="bookmark-selected" name="Bookmarks" />
      {archiveItems}
    </main>
  );
}
