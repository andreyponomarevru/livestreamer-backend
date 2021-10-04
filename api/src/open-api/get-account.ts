export const getAccount = {
  summary: "Returns the specific account.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    { name: "user id", in: "path", required: true, description: "user ID" },
  ],

  responses: {
    "200": {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: { $ref: "#/components/schemas/Account" },
            },
          },
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
      description: "Unauthorized.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "403": {
      description:
        "Forbidden. Insufficient rights to a resource: client attempts a resource interaction that is outside of his role permissions.",
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
