export const postBookmark = {
  summary: "Creates a bookmark of broadcast.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    { name: "user id", in: "path", required: true, description: "user ID" },
  ],

  requestBody: {
    required: true,
    description: "Broadcast ID to add to bookmarks.",
    content: {
      "application/x-www-form-urlencoded": {
        schema: {
          $ref: "#/components/schemas/CreateBookmarkRequest",
        },
      },
    },
  },

  responses: {
    "204": {
      description:
        "Bookmark saved i.e. the broadcast added to user's account bookmarks.",
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

    "409": {
      description:
        "Conflict. The broadcast with provided ID already exists in user bookmarks.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
