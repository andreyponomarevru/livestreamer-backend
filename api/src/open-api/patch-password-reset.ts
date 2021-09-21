export const patchPasswordUpdate = {
  summary:
    "If the user sends request containing only email, the route sends password reset (=password update) token to user's verified email.\n\nIf the user sends request containing the previously provided password reset token (the one he got on email) + new password, the route just saves new password.",

  security: [], // no authentication

  requestBody: {
    required: true,
    description:
      "If the request is to get the new password reset token — body must contain the user email used during registration (the email must be verified).\n\nIf the request is to save the new password — body must contain the previously obtained password reset token AND new password",
    content: {
      "application/json": {
        schema: {
          oneOf: [
            { $ref: "#/components/schemas/GetPasswordResetTokenRequest" },
            { $ref: "#/components/schemas/SaveNewPasswordRequest" },
          ],
        },
      },
    },
  },

  responses: {
    "202": {
      description:
        "Accepted. The request has been accepted for processing, but the processing has not been completed. Means that the link with password reset token has been send to user's email (no matter whether the provided user email exists or not, whether it is verified or not, the response is the same 202)",
    },

    "204": {
      description: "The new password has been successfully saved.",
    },

    "400": {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "401": {
      headers: { "WWW-Authenticate": { schema: { type: "string" } } },
      description:
        "Unauthorized. Unauthenticated user attempts to send the request. This error returned when user supplied invalid password reset token or doesn't send it at all.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
