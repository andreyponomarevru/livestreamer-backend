import { useState, useEffect } from "react";

import { IWebSocketClient } from "../ws-client";
import { ClientCount } from "../types";

function useWSClientCount(ws: IWebSocketClient): ClientCount {
  const [clientCount, setClientCount] = useState<ClientCount>({ count: 0 });
  useEffect(() => {
    let isMounted = true;
    if (isMounted) ws.bindToServerEvents("chat:client_count", setClientCount);

    return () => {
      isMounted = false;
      ws.unbindFromServerEvents("chat:client_count", setClientCount);
    };
  }, []);

  return clientCount;
}

export { useWSClientCount };
