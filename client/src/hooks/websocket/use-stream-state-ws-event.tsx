import { useWebSocketEvents } from "../use-websocket-events";
import { BroadcastState } from "../../types";

function useStreamStateWSEvent() {
  const streamState = useWebSocketEvents<BroadcastState>("stream:state", {
    isOnline: false,
  });

  return streamState;
}

export { useStreamStateWSEvent };
