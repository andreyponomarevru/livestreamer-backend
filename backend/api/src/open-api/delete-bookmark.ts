export const deleteBookmark = {
  summary: "Deletes a bookmark (bookmarked broadcast).",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    { name: "user id", in: "path", required: true, description: "user ID" },
  ],

  responses: {
    "204": {
      description: "Bookmark successfully deleted.",
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
