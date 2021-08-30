export const postStream = {
  summary: "Push audio stream.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    {
      name: "transfer-encoding",
      in: "header",
      required: true,
      description:
        "The form of encoding used to safely transfer the payload body to the user",
    },
  ],

  requestBody: {
    content: { "audio/mpeg": { schema: { type: "string", format: "binary" } } },
  },

  responses: {
    "201": {
      description: "Broadcast successfully created i.e. saved.",
      headers: { location: { schema: { type: "string" } } },
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Broadcast" },
        },
      },
    },

    "415": {
      description: "Unsupported Media Type.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
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
      description:
        "Unauthorized. Unauthenticated user attempts to send the request.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "403": {
      description:
        "Forbidden. Insufficient rights to a resource: authenticated but  unauthorized client attempts a resource interaction that is outside of his role permissions.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
