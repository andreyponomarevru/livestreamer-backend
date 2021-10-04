export const getChatComments = {
  summary: "Returns comments (paginated, 50 per page).",

  description:
    "Uses cursor pagination. Example: `/chat/messages?next_cursor=2&limit=2`",

  security: { cookieAuth: [] },

  parameters: [
    {
      name: "next_cursor",
      in: "query",
      description: "Retrieve records starting from this cursor",
      required: true,
      schema: { type: "number" },
    },
    {
      name: "limit",
      in: "query",
      description: "Limit number of messages per page",
      required: true,
      schema: { type: "number" },
    },
  ],

  responses: {
    "200": {
      description: "A list of last <limit> chat messages.",
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
