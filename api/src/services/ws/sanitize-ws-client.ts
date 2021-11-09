import { WSClient } from "../../types";

export function sanitizeWSClient(client: WSClient) {
  return {
    uuid: client.uuid,
    username: client.username,
  };
}
