export const postUser = {
  summary: "Creates a user.",
  description:
    "Regular unauthenticated users and user assigned a 'superuser' role required to submit different types of request objects.\n\n'superadmin' required to provide some additional properties: 'role_name', 'permissions' object, 'is_confirmed'.\n\nUnauthenticated users attempting to send these properties recieve 401 Bad Request response.\n\nResponse for 'superadmin' user is UserAccount object. For all other users the response object is UserProfile object",

  security: { cookieAuth: [], basicAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
  ],

  requestBody: {
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
    "201": {
      description: "User successfully created.",
      headers: {
        location: { schema: { type: "string" } },
      },
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { type: "object", $ref: "#/components/schemas/UserProfile" },
              { type: "object", $ref: "#/components/schemas/UserAccount" },
            ],
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
      headers: { "WWW-Authenticate": { schema: { type: "string" } } },
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
