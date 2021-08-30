export const postTracklist = {
  summary: "Uploads a tracklist.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
  ],

  requestBody: {
    content: {
      // DOC (Multipart Requests): https://swagger.io/docs/specification/describing-request-body/multipart-requests/
      "multipart/form-data": {
        schema: { $ref: "#/components/schemas/CreateOrUpdateTracklistRequest" },
        encoding: { tracklist: { contentType: "text/plain" } },
      },
    },
  },

  responses: {
    "204": {
      description: "Tracklist successfully uploaded.",
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
      description: "Conflict. Broadcast with this id already has tracklist.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
