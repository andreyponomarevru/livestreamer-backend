export const postBroadcastLike = {
  summary:
    "Saves like for the currently streaming broadcast. If the stream is  finished, the route will deny any request.",

  description:
    "Only requests with 10-sec interval are allowed. Increments broadcast like counter. Server sends likes counter updates through WebSocket.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
  ],

  responses: {
    "200": {},

    "401": {
      headers: { "WWW-Authenticate": { schema: { type: "string" } } },
      description:
        "Unauthorized. Unauthenticated user attempts to send the request.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "410": {
      description:
        "Gone. You can't like the broadcast after the stream is finished.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "429": {
      description: "Too Many Requests. 10-sec interval is required.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
