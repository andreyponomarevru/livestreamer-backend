import React, { ReactElement } from "react";

import { PlayerLinkForm } from "../../../lib/player-link-form/player-link-form";
import { TracklistForm } from "../../../lib/tracklist-form/tracklist-form";
import { Btn } from "../../../lib/btn/btn";
import { Loader } from "../../../lib/loader/loader";

import "../../../lib/btn/btn.scss";
import "./archive-item-controls.scss";
import "../../../lib/text-input/text-input.scss";

function ArchiveItemControls(
  props: React.HTMLAttributes<HTMLDivElement>
): ReactElement {
  // TODO: send request to API and change the hardcoded 'isLoaded' value on buttons
  const apiResponse = { broadcast: { isVisible: true } };

  return (
    <div className="archive-item-controls">
      <div></div>
      <Btn
        theme="white"
        isLoading={false}
        name={
          apiResponse.broadcast.isVisible
            ? "Publish Broadcast"
            : "Hide broadcast"
        }
      >
        <Loader for="btn" color="black" />
      </Btn>

      <TracklistForm />
      <PlayerLinkForm />
      <Btn theme="white" name="Delete Broadcast" isLoading={false}>
        <Loader color="black" for="btn" />
      </Btn>
    </div>
  );
}

export { ArchiveItemControls };
