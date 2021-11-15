/*
import { useState, useEffect } from "react";

import { IWebSocketClient } from "../ws-client";
import { BroadcastState } from "../types";

function useWSStreamState(ws: IWebSocketClient): BroadcastState {
  const [streamState, setStreamState] = useState<BroadcastState>({
    isOnline: false,
  });

  useEffect(() => {
    let isMounted = true;

    if (isMounted) ws.bindToServerEvents("stream:state", setStreamState);

    return () => {
      isMounted = false;
      ws.unbindFromServerEvents("stream:state", setStreamState);
    };
  }, [streamState, ws]);

  return streamState;
}

export { useWSStreamState };
*/
