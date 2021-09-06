export const getBroadcasts = {
  summary: "Returns a list of broadcasts.",

  description:
    "For non-'superuser' users returns all publicly available broadcasts.\n\nFor 'superuser' returns all publicly available broadcasts AND currently hidden broadcasts. 'superuser' can also request broadcasts by type.",

  parameters: [
    {
      name: "cookie",
      in: "header",
      required: false,
      description: "Session ID",
    },

    {
      name: "visibility",
      in: "query",
      required: false,
      description: "Broadcast type",
      style: "form",
      // https://swagger.io/docs/specification/serialization/
      schema: {
        type: "string",
        enum: ["hidden", "published"],
      },
    },
  ],

  responses: {
    "200": {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: { $ref: "#/components/schemas/Broadcast" },
              },
            },
          },
        },
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
};
