export const postPasswordReset = {
  summary: "Create release.",

  security: [], // no authentication

  requestBody: {
    required: true,
    description: "User email used during registration.",
    content: {
      "application/x-www-form-urlencoded": {
        schema: {
          $ref: "#/components/schemas/ResetPasswordRequest",
        },
      },
    },
  },

  // TODO: the endpoint features should be extended for password reset token verification OR you maybe you need to create another extra endpoint for token verification/new password submission. But I think the new password can be submitted to /users/id

  responses: {
    "204": {
      description:
        "Sends the link (containing the short-living token) to reset the password to user's email.\n\n No matter whether the provided user email exists or not, the response is 200.",
    },

    "400": {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
