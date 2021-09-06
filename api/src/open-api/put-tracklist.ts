export const putTracklist = {
  summary: "Updates tracklist.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
    {
      name: "broadcast id",
      in: "path",
      required: true,
      description: "broadcast ID",
    },
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
      description: "Tracklist successfully updated.",
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
      description: "Unauthorized.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "403": {
      description: "Forbidden.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },

    "404": {
      description: "Not Found.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
