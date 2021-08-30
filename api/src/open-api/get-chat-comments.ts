export const getChatComments = {
  summary: "Returns comments (paginated, 50 per page).",

  description: "Uses cursor pagination.",

  security: { cookieAuth: [] },

  parameters: [
    {
      name: "cookie",
      in: "header",
      required: false,
      description: "Session ID",
    },
    {
      name: "page",
      in: "query",
      description: "Response page number",
      required: false,
      schema: { type: "number" },
    },
  ],

  responses: {
    "200": {
      description: "A list of last 50 chat messages.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              nextPage: {
                type: "string",
                nullable: true,
                description: "Link to the next page of response",
              },
              previousPage: { type: "string", nullable: true },
              results: {
                type: "array",
                items: { $ref: "#/components/schemas/ChatComment" },
              },
            },
          },
        },
      },
    },
  },
};
