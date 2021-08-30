export const postChatComment = {
  summary: "Saves chat comment.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
  ],

  requestBody: {
    content: {
      "application/x-www-form-urlencoded": {
        schema: { $ref: "#/components/schemas/CreateChatCommentRequest" },
      },
    },
  },

  responses: {
    "204": { description: "Comment sent and saved to db." },

    "400": {
      description: "Bad Request.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "401": {
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
