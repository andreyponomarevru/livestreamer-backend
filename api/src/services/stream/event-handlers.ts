import { wsService } from "../ws";
import {
  BroadcastDraft,
  SavedBroadcastLike,
  WSClient,
  BroadcastState,
} from "../../types";

export function onStreamLike(
  like: SavedBroadcastLike & { likedByUserUUID: string },
): void {
  wsService.sendToAllExceptSender(
    { event: "stream:like", data: like },
    { senderUUID: like.likedByUserUUID },
    wsService.clientStore.clients,
  );
}

export function onStreamStart(broadcast: BroadcastDraft): void {
  wsService.sendToAll(
    { event: "stream:state", data: { isOnline: true, broadcast } },
    wsService.clientStore.clients,
  );
}

export function onStreamEnd(): void {
  wsService.sendToAll(
    { event: "stream:state", data: { isOnline: false } },
    wsService.clientStore.clients,
  );
}

export function sendBroadcastState(
  reciever: WSClient,
  broadcastState: BroadcastState,
): void {
  wsService.send({ event: "stream:state", data: broadcastState }, reciever);
}
