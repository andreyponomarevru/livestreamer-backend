export const deleteChatComment = {
  summary: "Deletes a chat comment.",

  description:
    "Regular users can delete only their own comments, while 'superadmin' can delete any comment.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    {
      name: "chat comment ID}",
      in: "path",
      required: true,
      description: "chat comment ID",
    },
  ],

  responses: {
    "204": {
      description: "Comment successfully deleted.",
    },

    "400": {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "401": {
      headers: { "WWW-Authenticate": { schema: { type: "string" } } },
      description: "Unauthorized.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "403": {
      description: "Forbidden.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "404": {
      description: "Not Found.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
