import { describe, it } from "@jest/globals";

describe("GET /stream - push audio stream from the streaming client to the app server", () => {
  describe("200", () => {
    // expect the response body of type "audio/mpeg": { schema: { type: "string", format: "binary" } },
    it.todo(
      "responds with an audio stream of the current broadcast if the stream exists",
    );
    // check for the presence of these headers in the request:
    // expect "cache-control" to be string
    // expect "content-type" to be string
    // expect "transfer-encoding" to be string
    // expect "expires" to be a number
  });

  describe("404", () => {
    it.todo("responds with an error if the broadcast stream doesn't exist");
  });
});

describe("POST /stream", () => {
  describe("200", () => {
    it.todo("accepts the 'audio/mpeg' binary stream");
  });

  describe("201", () => {
    it.todo("responds with a new saved broadcast");
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo(
      "responds with an error for the user with the role other than the 'Broadcaster'",
    );
  });

  describe("415", () => {
    it.todo(
      "responds with an error if the body media type is not 'audio/mpeg'",
    );
  });

  describe("400", () => {
    it.todo("responds with an error if the body has a non-binary format");
  });
});
