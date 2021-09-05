import React, { ReactElement, Fragment } from "react";

import { ArchiveItem } from "../../components/archive-item/archive-item";
import { PageHeading } from "../../components/lib/page-heading/page-heading";

const meta = {
  timestamp: "2312013",
  title: "Test Stream",
  description:
    "Some short detxt description of this show that should not exceed 255 characters it'l like a smal tweet, just put soming here and that's it",
  heartsCount: 3,
  peakListenersCOunt: 8,
};

export function PagesArchive(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  return (
    <main className="archive-page">
      <PageHeading iconName="archive" name="Archive" />
      <ArchiveItem
        title={meta.title}
        heartsCount={meta.heartsCount}
        peakListenersCount={meta.peakListenersCOunt}
        description={meta.description}
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
      <ArchiveItem
        title={meta.title}
        heartsCount={meta.heartsCount}
        peakListenersCount={meta.peakListenersCOunt}
        description={meta.description}
        timestamp={meta.timestamp}
      />
    </main>
  );
}
