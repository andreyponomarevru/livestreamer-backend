export const getUsers = {
  summary: "Returns all users (not paginated).",
  description: "non-'superadmin' users are not allowed to access this route.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
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
                  results: {
                    type: "array",
                    items: { $ref: "#/components/schemas/UserAccount" },
                  },
                },
              },
              {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: { $ref: "#/components/schemas/UserProfile" },
                  },
                },
              },
            ],
          },
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
      description:
        "Forbidden. Insufficient rights to a resource: client attempts a resource interaction that is outside of his role permissions.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
