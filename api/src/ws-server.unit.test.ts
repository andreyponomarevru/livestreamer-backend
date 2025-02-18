import { jest, describe, it, expect } from "@jest/globals";
import { wsServer } from "./ws-server";
import { onClose, onConnection, wsService } from "./services/ws";
import {
  chatService,
  onCreateChatMsg,
  onDestroyChatMsg,
  onLikeChatMsg,
  onUnlikeChatMsg,
  onAddClient,
  onDeleteClient,
  onUpdateClientCount,
  onChatStart,
} from "./services/chat";
import {
  onStreamStart,
  streamService,
  onStreamEnd,
  onStreamLike,
} from "./services/stream";

jest.mock("./services/stream/event-handlers");
jest.mock("./services/chat/event-handlers");
jest.mock("./services/ws/event-handlers");

describe("wsServer", () => {
  [
    { event: "connection", handler: onConnection },
    { event: "connection", handler: onChatStart },
    { event: "close", handler: onClose },
  ].forEach(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ({ event, handler }: { event: string; handler: Function }) => {
      it(`event '${event}' triggers the event handler '${handler.name}'`, () => {
        wsServer.emit(event);

        expect(jest.mocked(handler)).toBeCalledTimes(1);
      });
    },
  );
});

describe("wsService.clientStore", () => {
  [
    { event: "add_client", handler: onAddClient },
    { event: "delete_client", handler: onDeleteClient },
    { event: "update_client_count", handler: onUpdateClientCount },
  ].forEach(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ({ event, handler }: { event: string; handler: Function }) => {
      it(`event '${event}' triggers the event handler '${handler.name}'`, () => {
        wsService.clientStore.emit(event);

        expect(jest.mocked(handler)).toBeCalledTimes(1);
      });
    },
  );
});

describe("streamService", () => {
  [
    { event: "start", handler: onStreamStart },
    { event: "end", handler: onStreamEnd },
    { event: "like", handler: onStreamLike },
  ].forEach(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ({ event, handler }: { event: string; handler: Function }) => {
      it(`event '${event}' triggers the event handler '${handler.name}'`, () => {
        streamService.events.emit(event);

        expect(jest.mocked(handler)).toBeCalledTimes(1);
      });
    },
  );
});

describe("chatService", () => {
  [
    { event: "create_message", handler: onCreateChatMsg },
    { event: "delete_message", handler: onDestroyChatMsg },
    { event: "like_message", handler: onLikeChatMsg },
    { event: "unlike_message", handler: onUnlikeChatMsg },
  ].forEach(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ({ event, handler }: { event: string; handler: Function }) => {
      it(`event '${event}' triggers the event handler '${handler.name}'`, () => {
        chatService.events.emit(event);

        expect(jest.mocked(handler)).toBeCalledTimes(1);
      });
    },
  );
});
