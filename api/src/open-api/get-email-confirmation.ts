export const getEmailConfirmation = {
  summary:
    "Sends signup email confirmation token back to server. We do it via GET request, because email link allows only GET method",
  description:
    "After the user has signed up, his status in the system is 'is_confirmed: false' and a link containing verification token is sent to his email. To confirm the registration he needs to confirm his email by clicking this link — clicking the links means sending a GET request containing the token to this route. If the token is valid, the sign up is confirmed and user can sign in.\n\nAfter user has confirmed the sign up, he recieves an email saying that the sign up process is finished.",

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
