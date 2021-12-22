export const getSettings = {
  summary: "Returns all users (not paginated).",

  security: { cookieAuth: [] },

  responses: {
    "200": {
      description: "A list of users.",
      content: {
        "application/json": {
          schema: {
            oneOf: [
              {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: { $ref: "#/components/schemas/UserProfileShort" },
                  },
                },
              },
              {
                type: "object",
                properties: {
                  results: {
                    type: "array",
                    items: { $ref: "#/components/schemas/UserProfileFull" },
                  },
                },
              },
            ],
          },
        },
      },
    },

    "403": {
      description:
        "Forbidden. Insufficient rights to a resource: client attempts a resource interaction that is outside of his role permissions.",
    },
  },
};
