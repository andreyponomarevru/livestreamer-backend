export const postUser = {
  summary: "Creates a user.",
  description:
    "Username and password should always be provided only in 'Authroization' header using 'Basic' schema. All other data — in JSON body. \n\nThis route should be used by new users to sign up i.e. to create a new account. User must include username:password in header and his email in JSON-encoded  body",

  security: { basicAuth: [] },

  parameters: [
    {
      name: "Authorization",
      in: "header",
      required: true,
      description:
        "Always provide username and password in 'Authorization' header, using 'Basic' schema, don't include them in the body. The body should contain only email.",
    },
  ],

  requestBody: {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          $ref: "#/components/schemas/CreateUserRequest",
        },
      },
    },
  },

  responses: {
    "202": {
      description:
        "User successfully created. User hasn't confirmed his email yet, so the response is empty. \n\n202 code — The request has been accepted for processing, but the processing has not been completed. The request might or might not eventually be acted upon, as it might be disallowed when processing actually takes place. There is no facility for re-sending a status code from an asynchronous operation such as this.",
      headers: {
        location: { schema: { type: "string" } },
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

    "403": {
      description:
        "Forbidden. Insufficient rights to a resource: authenticated but  unauthorized client attempts a resource interaction that is outside of his role permissions.\n\nI.e. this error is returned only when authenticated but non-'superadmin' user tries to post data.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "409": {
      description: "Conflict. User with this username or email already exists.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
