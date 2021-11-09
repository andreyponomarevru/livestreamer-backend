import WebSocket from "ws";

import { WSClient } from "../../types";

class WSChatClient implements WSClient {
  readonly id?: number;
  readonly username: string;
  readonly uuid: string;
  readonly socket: WebSocket;

  constructor(client: {
    uuid: string;
    id?: number;
    username?: string;
    socket: WebSocket;
  }) {
    this.uuid = client.uuid;
    this.id = client.id;
    this.username = client.username || this.buildUsername(client.uuid);
    this.socket = client.socket;
  }

  private buildUsername(str: string): string {
    return str.substr(0, 8);
  }
}

export { WSChatClient };
