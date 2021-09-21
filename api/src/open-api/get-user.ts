export const getUser = {
  summary: "Returns the specific user.",
  description:
    "For 'superadmin' returns the specified user as 'UserAccount' object.\n\nFor all other users returns only their own data as 'UserProfile' object.",

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
            oneOf: [
              {
                type: "object",
                properties: {
                  results: { $ref: "#/components/schemas/UserAccount" },
                },
              },
              {
                type: "object",
                properties: {
                  results: { $ref: "#/components/schemas/UserProfile" },
                },
              },
            ],
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
