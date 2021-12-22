export const patchUser = {
  summary: "Updates user's data.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    { name: "user id", in: "path", required: true, description: "user ID" },
  ],

  requestBody: {
    description: "It is possible to update only one prop — 'username'.",
    content: {
      "application/json": {
        schema: {
          type: "object",
          $ref: "#/components/schemas/UpdateUserRequest",
        },
      },
    },
  },

  responses: {
    "200": {
      description: "Updates user's data and returns the updated object.",
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

    "409": {
      description: "Conflict. User with this username or email already exists.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
