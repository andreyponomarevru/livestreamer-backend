import React, { ReactElement } from "react";

import { PlayerLinkForm } from "../player-link-form/player-link-form";
import { TracklistForm } from "../tracklist-form/tracklist-form";

import "../../../lib/btn/btn.scss";
import "./archive-item-controls.scss";
import "../../../lib/text-input/text-input.scss";

export function ArchiveItemControls(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  const { className = "" } = props;

  const apiResponse = { broadcast: { isVisible: true } };

  return (
    <div className="archive-item-controls">
      <div></div>
      <button className="btn btn_theme_white">
        {apiResponse.broadcast.isVisible
          ? "Publish Broadcast"
          : "Hide broadcast"}
      </button>

      <TracklistForm />
      <PlayerLinkForm />
      <button className="btn btn_theme_white">Delete Broadcast</button>
    </div>
  );
}
