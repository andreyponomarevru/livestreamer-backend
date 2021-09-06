export const deleteSession = {
  summary: "Deletes a session: logs out and removes cookie.",

  security: { cookieAuth: [] },

  parameters: [
    {
      name: "cookie",
      in: "header",
      required: true,
      description: "Session ID",
      schema: { type: "string", example: "SESSIONID=..." },
    },
  ],

  responses: {
    "204": {
      description: "Session successfully deleted.",
    },
  },

  "401": {
    headers: { "WWW-Authenticate": { schema: { type: "string" } } },
    description: "Unauthorized. User is not authenticated.",
    content: {
      "application/json": {
        schema: { type: "object", $ref: "#/components/schemas/Error" },
      },
    },
  },
};
