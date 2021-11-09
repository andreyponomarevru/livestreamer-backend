import { sendToAll, sendToAllExceptSender } from "../ws";
import { clientStore } from "../ws";
import { BroadcastDraft, SavedBroadcastLike } from "../../../types";

export function onStreamLike(
  like: SavedBroadcastLike & { likedByUserUUID: string },
): void {
  sendToAllExceptSender(
    { event: "stream:like", data: like },
    { senderUUID: like.likedByUserUUID },
    clientStore.clients,
  );
}

export function onStreamStart(broadcast: BroadcastDraft): void {
  sendToAll(
    { event: "stream:state", data: { isOnline: true, broadcast } },
    clientStore.clients,
  );
}

export function onStreamEnd(): void {
  sendToAll(
    { event: "stream:state", data: { isOnline: false } },
    clientStore.clients,
  );
}
