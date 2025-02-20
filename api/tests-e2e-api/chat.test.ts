import { describe, it } from "@jest/globals";

describe("GET /chat/messages - get all chat messages paginated", () => {
  describe("200", () => {
    it.todo("responds with an array of messages paginated");

    // "Uses cursor pagination. Example: `/chat/messages?next_cursor=2&limit=2`",
    it.todo("responds with object containing the pagination cursor");

    it.todo("responds with messages paginated 50 per page");

    it.todo(
      "retrieves messages starting from the 'next_cursor' sent as query parameter in ",
    );

    it.todo(
      "limits the number of messages per pages based on the 'limit' query parameter",
    );
  });

  describe("400", () => {
    it.todo(
      "responds with an error if the query doesn't contain the parameter 'next_cursor'",
    );
  });
});

describe("POST /chat/messages", () => {
  describe("204", () => {
    it.todo(
      "responds with an empty body if the message has been sent and saved successfuly",
    );
  });

  describe("400", () => {
    it.todo(
      "responds with an error if the body type is not 'application/x-www-form-urlencoded'",
    );
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo(
      "responds with an error if the user doesn't have the required permissions",
    );
  });
});

describe("DELETE /chat/messages/:id - delete chat message", () => {
  describe("204", () => {
    it.todo(
      "responds with an empty body if the message has been successfuly deleted",
    );

    it.todo(
      "allows the user with the role 'Listener' role delete only their own comments",
    );

    it.todo("allows the user with the 'superadmin' role delete any comment");
  });

  describe("400", () => {
    it.todo(
      "responds with an error if the path doesn't contain the chat message :id",
    );
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo(
      "responds with an error if the user with the 'Listener' role attempts to delete someone else's message",
    );
  });

  describe("404", () => {
    it.todo("responds with an error if chat message doesn't exist");
  });
});

describe("POST /chat/messages/:id/like - like chat message", () => {
  describe("204", () => {
    it.todo(
      "responds with an empty body if the message has been successfuly liked",
    );
    it.todo("allows the user to like his own message");
  });

  describe("400", () => {
    it.todo(
      "responds with an error if the path doesn;t contain the message id",
    );
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo(
      "responds with an error if the user doesn't have the required permissions",
    );
  });

  describe("409", () => {
    it.todo("responds with an error if the message has already been liked");
  });
});

describe("DELETE /chat/messages/:id/like - unlike chat message", () => {
  describe("204", () => {
    it.todo(
      "responds with an empty body is the message has been successfuly unliked",
    );
  });

  describe("400", () => {
    it.todo(
      "responds with an error if the path doesn't contain the message :id",
    );
  });

  describe("401", () => {
    it.todo("responds with an error if the user is not authenticated");
    it.todo(
      "responds with an error if the header doesn't contain the session cookie",
    );
  });

  describe("403", () => {
    it.todo(
      "responds with an error if the user doesn't have the required permissions",
    );
  });

  describe("404", () => {
    it.todo("responds with an error if the message doesn't exist");
  });
});
