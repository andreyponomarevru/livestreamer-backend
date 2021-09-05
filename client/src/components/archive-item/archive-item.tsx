import React, { ReactElement, useState } from "react";

import { IconBtn } from "../lib/icon-btn/icon-btn";
import { ArchiveItemControls } from "./archive-item-controls/archive-item-controls";

import "./archive-item.scss";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
  heartsCount: number;
  peakListenersCount: number;
  description?: string;
  bookmarked?: boolean;
  timestamp: string;

  permissions?: {
    broadcast: string;
  };
}

export function ArchiveItem(props: Props): ReactElement {
  const { className = "", bookmarked = false } = props;

  // Moch API resposne:
  const permissions = { broadcast: ["update"] };

  //

  const [isControlsOpened, setIsControlsOpened] = useState(false);

  function toggleControls() {
    setIsControlsOpened((prev) => !prev);
  }

  return (
    <div className={`archive-item ${className}`}>
      <div className="archive-item__meta1">
        <span className="archive-item__date">{props.timestamp}</span>
        <IconBtn
          iconName={props.bookmarked ? "bookmark-selected" : "bookmark"}
          handleBtnClick={() => {}}
          className="archive-item__bookmark"
        />
      </div>
      <h3
        className="archive-item__heading"
        contentEditable={permissions.broadcast.includes("update")}
        suppressContentEditableWarning={true}
      >
        {props.title} 6 Hour New Year Ambient Mix
      </h3>
      <div className="archive-item__meta2">
        <span className="archive-item__listeners">
          Max Listeners:{" "}
          <span className="archive-item__count">
            {props.peakListenersCount}
          </span>
        </span>
        <span className="archive-item__hearts">
          Hearts:{" "}
          <span className="archive-item__count">{props.heartsCount}</span>
        </span>
      </div>
      <div
        className="archive-item__description"
        contentEditable={permissions.broadcast.includes("update")}
        suppressContentEditableWarning={true}
      >
        {props.description}
      </div>
      <div className="archive-item__controls">
        <IconBtn iconName="tracklist" handleBtnClick={() => {}} />
        <IconBtn iconName="play" handleBtnClick={() => {}} />
        {permissions.broadcast.includes("update") && (
          <IconBtn iconName="pencil" handleBtnClick={toggleControls} />
        )}
      </div>
      {isControlsOpened && <ArchiveItemControls />}
    </div>
  );
}
