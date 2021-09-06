export const postStreamLike = {
  summary: "Saves like to the stream.",

  description:
    "Only requests with 10-sec interval are allowed. Increments stream like counter. Server sends likes counter updates through WebSocket.",

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
