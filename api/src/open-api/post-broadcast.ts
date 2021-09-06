export const postBroadcast = {
  summary: "Creates a broadcast.",
  description: "Creates i.e. saves a new broadcast.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
  ],

  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          $ref: "#/components/schemas/SaveBroadcastRequest",
        },
      },
    },
  },

  responses: {
    "201": {
      description: "Broadcast successfully saved.",
      headers: {
        location: { schema: { type: "string" } },
      },
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Broadcast" },
        },
      },
    },

    "400": {
      description: "Bad Request.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

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

    "403": {
      description:
        "Forbidden. Insufficient rights to a resource: authenticated but  unauthorized client attempts a resource interaction that is outside of his role permissions.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
