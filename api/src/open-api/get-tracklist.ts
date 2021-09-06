export const getTracklist = {
  summary: "Returns broadcast's tracklist.",

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
        "text/plain": {},
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
  },
};
