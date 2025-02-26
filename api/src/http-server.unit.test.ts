import { jest, describe, it, expect } from "@jest/globals";
import { httpServer } from "./http-server";
import {
  onServerError,
  onServerListening,
  onServerUpgrade,
} from "./http-server-event-handlers";

jest.mock("./http-server-event-handlers");

describe("wsServer", () => {
  [
    { event: "error", handler: onServerError },
    { event: "listening", handler: onServerListening },
    { event: "upgrade", handler: onServerUpgrade },
  ].forEach(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ({ event, handler }: { event: string; handler: Function }) => {
      it(`event '${event}' triggers the event handler '${handler.name}'`, () => {
        httpServer.emit(event);

        expect(jest.mocked(handler)).toBeCalledTimes(1);
      });
    },
  );
});
