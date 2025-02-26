import { useWebSocketEvents } from "./../use-websocket-events";
import { ClientCount } from "../../types";

function useClientCountWSEvent() {
  const clientCount = useWebSocketEvents<ClientCount>("chat:client_count", {
    count: 0,
  });

  return { clientCount };
}

export { useClientCountWSEvent };
