import { useState, useEffect } from "react";
import { IWebSocketClient } from "../ws-client";
import { SavedBroadcastLike } from "../types";

function useWSStreamLike(ws: IWebSocketClient): SavedBroadcastLike | undefined {
  const [streamLike, setStreamLike] = useState<SavedBroadcastLike>();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) ws.bindToServerEvents("stream:like", setStreamLike);

    return () => {
      isMounted = false;
      ws.unbindFromServerEvents("stream:like", setStreamLike);
    };
  }, []);

  return streamLike;
}

export { useWSStreamLike };
