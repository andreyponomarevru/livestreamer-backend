import * as React from "react";

import { StreamBarState } from "../stream-bar-status/stream-bar-status";
import { Counter } from "../counter/counter";
import { API_STREAM_URL, API_ROOT_URL } from "../../config/env";
import { usePlayer } from "../../hooks/use-player";
import { PlayToggleBtn } from "../play-toggle-btn/play-toggle-btn";
import { useWebSocketEvents } from "../../hooks/use-ws-stream-like";
import { SavedBroadcastLike, BroadcastState, ClientCount } from "../../types";

import "./stream-bar.scss";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function StreamBar(props: Props): React.ReactElement {
  const clientCount = useWebSocketEvents<ClientCount>("chat:client_count", {
    count: 0,
  });
  const streamState = useWebSocketEvents<BroadcastState>("stream:state", {
    isOnline: false,
  });
  const streamLike = useWebSocketEvents<SavedBroadcastLike | null>(
    "stream:like",
    null
  );
  const [player, togglePlay] = usePlayer(`${API_ROOT_URL}${API_STREAM_URL}`);

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
    <div className={`stream-bar ${props.className}`}>
      <PlayToggleBtn
        isDisabled={!streamState.isOnline}
        handleBtnClick={togglePlay}
      />
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
