import { sendToAll } from "../ws";
import { clientStore } from "../ws";
import { DeletedWSClient, SanitizedWSChatClient } from "../../../types";

export function onAddClient({
  client,
  clientCount,
}: {
  client: SanitizedWSChatClient;
  clientCount: number;
}): void {
  sendToAll({ event: "chat:new_client", data: client }, clientStore.clients);
}

export function onDeleteClient(client: DeletedWSClient): void {
  sendToAll(
    { event: "chat:deleted_client", data: client },
    clientStore.clients,
  );
}

export function onUpdateClientCount(clientCount: number): void {
  sendToAll(
    { event: "chat:client_count", data: { count: clientCount } },
    clientStore.clients,
  );
}
