export const patchBroadcast = {
  summary: "Updates broadcast's data.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    {
      name: "broadcast id",
      in: "path",
      required: true,
      description: "broadcast ID",
    },
  ],

  requestBody: {
    description:
      "Note that there are no required properties in JSON object, but you should specify at least one to update.",
    content: {
      "application/json": {
        schema: {
          type: "object",
          $ref: "#/components/schemas/UpdateBroadcastRequest",
        },
      },
    },
  },

  responses: {
    "200": {
      description:
        "Updates broadcast's data and returns the updated broadcast.",
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
