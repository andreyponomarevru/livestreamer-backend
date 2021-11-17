import * as React from "react";

import { StreamBarState } from "../stream-bar-status/stream-bar-status";
import { Counter } from "../counter/counter";
import { API_STREAM_URL, API_ROOT_URL } from "../../config/env";
import { usePlayer } from "../../hooks/use-player";
import { PlayToggleBtn } from "../play-toggle-btn/play-toggle-btn";
import { useStreamLikeWSEvent } from "../../hooks/websocket/use-stream-like-ws-event";
import { useStreamStateWSEvent } from "../../hooks/websocket/use-stream-state-ws-event";
import { useClientCountWSEvent } from "../../hooks/websocket/use-client-count-ws--event";
import { useIsMounted } from "../../hooks/use-is-mounted";

import "./stream-bar.scss";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function StreamBar(props: Props): React.ReactElement {
  const { clientCount } = useClientCountWSEvent();
  const { streamState } = useStreamStateWSEvent();
  const { streamLike } = useStreamLikeWSEvent();

  const [likeCount, setLikeCount] = React.useState(
    streamState.broadcast?.likeCount || 0
  );

  React.useEffect(() => {
    if (streamState.broadcast) {
      setLikeCount(streamState.broadcast.likeCount || 0);
    }
  }, [streamState]);

  React.useEffect(() => {
    if (streamLike) {
      setLikeCount(streamLike.likeCount);
    }
  }, [streamLike]);

  return (
    <div className={`stream-bar ${props.className || ""}`}>
      <PlayToggleBtn isStreamOnline={streamState.isOnline} />
      <StreamBarState
        className="stream-bar__state"
        startAt={
          streamState.broadcast ? streamState.broadcast.startAt : undefined
        }
      />
      <div className="stream-bar__counters">
        <Counter
          idDisabled={!streamState.isOnline}
          icon="heart"
          count={likeCount}
        />
        <Counter idDisabled={false} icon="users" count={clientCount.count} />
      </div>
    </div>
  );
}
