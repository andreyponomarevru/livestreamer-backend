import React, { createContext } from "react";

import { WSMsgEvent, WSMsgPayload } from "./types";
import { WS_SERVER_URL } from "./config/env";

type Callback = React.Dispatch<React.SetStateAction<any>>;
interface IWebSocketClient {
  bindToServerEvents: (eventName: WSMsgEvent, callback: Callback) => this;
  unbindFromServerEvents: (eventName: WSMsgEvent, callback: Callback) => void;
}

class WebSocketClient implements IWebSocketClient {
  private socket: WebSocket;
  private callbacks: { [key in WSMsgEvent]: Callback[] };

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.callbacks = {} as { [key in WSMsgEvent]: Callback[] };

    this.socket.onopen = this.onOpen.bind(this);
    this.socket.onmessage = this.onMessage.bind(this);
    this.socket.onerror = this.onError.bind(this);
    this.socket.onclose = this.onClose.bind(this);
  }

  private onOpen() {
    // console.log("WS: [onopen]");
  }

  private onMessage(event: MessageEvent) {
    const { event: eventName, data: eventData } = JSON.parse(event.data);

    this.dispatch([eventName, eventData]);

    /*
    switch (eventName) {
      case "chat:add_client": {
        const addClient = {
          //client: data.client,
          //clientCount: data.clientCount,
        };
      }

      case "stream:online": 
      case "stream:offline": 
      case "stream:like": 
      }
      case "chat:create_message": {
        const chatMsg = data;
      }
      case "chat:delete_message": {
        const chatMsgId = data;
      }
      case "chat:like_message": {
        const chatMsgLike = data;
      }
      case "chat:unlike_message": {
        const chatMsgUnlike = data;
      }
      case "chat:delete_client": {
        const deletedClient = data;
      }
      case "chat:update_client_count": {
        const clientCount = data.clientCount;
      }
      default:
        break;
    }*/
  }

  private onError(err: Event) {
    console.error("WS: [onerror]", err);
    // TODO: when error event happens, usually it is followed by 'close' socket event so we need to implement the reconnect method right here in Error handler, not in onClose
  }

  private onClose(event: CloseEvent) {
    if (event.wasClean) {
      const { code, reason } = event;
      console.log(
        `WS: [onclose] Connection closed cleanly, code ${code} reason=${reason}`
      );
    } else {
      console.error(`WS: [onclose] Connection died`);
    }
  }

  private dispatch([eventName, eventData]: [WSMsgEvent, WSMsgPayload]) {
    const callbacksChain = this.callbacks[eventName];

    if (callbacksChain === undefined) return;
    for (let i = 0; i < callbacksChain.length; i++) {
      // console.log("executes callback in chain...");
      callbacksChain[i](eventData);
    }
  }

  bindToServerEvents(eventName: WSMsgEvent, callback: any): this {
    this.callbacks[eventName] = this.callbacks[eventName] || [];
    this.callbacks[eventName].push(callback);
    console.log("FUNCTIONS BOUND TO WS EVENTS: ", this.callbacks);
    // make chainable
    return this;
  }

  unbindFromServerEvents(eventName: WSMsgEvent, callback: any) {
    if (!this.callbacks[eventName]) {
      console.error("Can't unbind function which was not bound");
      return;
    }
    this.callbacks[eventName] = this.callbacks[eventName].filter(
      (f) => f !== callback
    );
  }

  send(eventName: WSMsgEvent, eventData: WSMsgPayload) {
    const payload = JSON.stringify([eventName, eventData]);
    this.socket.send(payload);
    return this;
  }
}

function WebSocketProvider({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  let wsClient: WebSocketClient | undefined;

  if (!wsClient) {
    console.log("CREATES NEW WS CLIENT");
    wsClient = new WebSocketClient(WS_SERVER_URL);
  }

  return (
    <WebSocketContext.Provider value={wsClient}>
      {children}
    </WebSocketContext.Provider>
  );
}

// Use Context to make WebSocket object available from any component
const WebSocketContext = createContext<WebSocketClient | null>(null);

export { WebSocketProvider, WebSocketContext, IWebSocketClient };
