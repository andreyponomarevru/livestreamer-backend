export const postSession = {
  summary: "Creates a session: logs in and returns the authentication cookie.",

  description:
    "Put all data (login + password) in JSON body, NOT in Authroization (Basic) header!\n\nNote, that for convinience, you can pass as login either your email or username (but not both at the same time).",

  security: [], // no authentication

  /*parameters: [
    {
      name: "authorization",
      in: "header",
      requried: true,
      description: "Basic username:password",
    },
  ],*/

  requestBody: {
    required: true,
    description:
      "A JSON object containing the login (email or username) and password.",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/CreateSessionRequest",
        },
      },
    },
  },

  responses: {
    "200": {
      description:
        "Session created i.e. user successfully authenticated. The session ID is returned in a cookie named 'SESSIONID'. You need to include this cookie in subsequent requests.\n\nIf a user has role 'admin' or 'superadmin', the response contains full user profile. For all other roles, response contains the short version of user profile.",
      headers: {
        "set-cookie": {
          description: "Session ID",
          schema: { type: "string", example: "SESSIONID=..." },
        },
      },
      content: {
        "application/json": {
          schema: {
            oneOf: [
              { type: "object", $ref: "#/components/schemas/UserAccount" },
              { type: "object", $ref: "#/components/schemas/UserProfile" },
            ],
          },
        },
      },
    },

    "400": {
      description:
        "Bad Request. Invalid data passed while user attempts to log in (empty  username or password fields).",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "401": {
      // headers: { "WWW-Authenticate": { schema: { type: "string" } } },
      description:
        "Unauthorized. User authentication failed due to invalid credentials: wrong email/username or password",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
