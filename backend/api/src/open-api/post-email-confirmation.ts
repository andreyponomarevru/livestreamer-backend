export const postEmailConfirmation = {
  summary: "Sends signup email confirmation token back to server.",

  parameters: [
    {
      name: "token",
      in: "query",
      required: true,
      description: "Sign up confirmation token.",
      schema: { type: "string" },
    },
  ],

  responses: {
    "204": {
      description: "User successfully confirmed.",
      headers: {
        location: { schema: { type: "string" } },
      },
    },

    "404": {
      description: "Token doesn't exist.",
    },

    "400": {
      description: "Bad Request.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
