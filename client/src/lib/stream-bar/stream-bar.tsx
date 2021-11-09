import React, { ReactElement, useState, useEffect, useContext } from "react";

import { StreamBarState } from "../stream-bar-status/stream-bar-status";
import { useWSStreamState } from "../../hooks/use-ws-stream-state";
import { WebSocketContext } from "../../ws-client";
import { useWSClientCount } from "../../hooks/use-ws-client-count";
import { Counter } from "../counter/counter";
import { API_STREAM_URL, API_ROOT_URL } from "../../config/env";
import { usePlayer } from "../../hooks/use-player";
import { PlayToggleBtn } from "../play-toggle-btn/play-toggle-btn";
import { useWSStreamLike } from "../../hooks/use-ws-stream-like";

import "./stream-bar.scss";

type Props = React.HTMLAttributes<HTMLDivElement>;

export function StreamBar(props: Props): ReactElement {
  const { className = "" } = props;

  const ws = useContext(WebSocketContext);
  if (!ws) throw new Error("WS context is `null`");

  const clientCount = useWSClientCount(ws);
  const broadcastState = useWSStreamState(ws);
  const broadcastLike = useWSStreamLike(ws);
  const [player, togglePlay] = usePlayer(`${API_ROOT_URL}${API_STREAM_URL}`);

  const [likeCount, setLikeCount] = useState(
    broadcastState.broadcast?.likeCount || 0
  );

  useEffect(() => {
    if (broadcastState.broadcast) {
      setLikeCount(broadcastState.broadcast.likeCount || 0);
    }
  }, [broadcastState]);

  useEffect(() => {
    if (broadcastLike) {
      setLikeCount(broadcastLike.likeCount);
    }
  }, [broadcastLike]);

  return (
    <div className={`stream-bar ${className || ""}`}>
      <PlayToggleBtn
        isDisabled={!broadcastState.isOnline}
        handleBtnClick={togglePlay}
      />
      <StreamBarState
        className="stream-bar__state"
        startAt={
          broadcastState.broadcast
            ? broadcastState.broadcast.startAt
            : undefined
        }
      />
      <div className="stream-bar__counters">
        <Counter
          idDisabled={!broadcastState.isOnline}
          icon="heart"
          count={likeCount}
        />
        <Counter idDisabled={false} icon="users" count={clientCount.count} />
      </div>
    </div>
  );
}
