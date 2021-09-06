export const getBroadcast = {
  summary: "Returns the specific broadcast.",
  description:
    "For 'superadmin' returns any existing specified broadcast, no matter whether it is hidden or published.\n\nFor all other users returns only 'published' broadcasts.",

  security: { cookieAuth: [] },

  parameters: [
    {
      name: "cookie",
      in: "header",
      required: false,
      description: "Session ID",
    },
    {
      name: "broadcast id",
      in: "path",
      required: true,
      description: "broadcast ID",
    },
  ],

  responses: {
    "200": {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: { $ref: "#/components/schemas/Broadcast" },
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
