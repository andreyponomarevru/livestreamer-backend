export const postSchedule = {
  summary: "Schedules a new broadcast.",

  security: { cookieAuth: [] },

  parameters: [
    { name: "cookie", in: "header", required: true, description: "Session ID" },
  ],

  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          $ref: "#/components/schemas/ScheduleBroadcastRequest",
        },
      },
    },
  },

  responses: {
    "201": {
      description:
        "New broadcast successfully scheduled. Returns the scheduled broadcast.",
      headers: {
        location: { schema: { type: "string" } },
      },
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/ScheduledBroadcast" },
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
      description:
        "Conflict. There is already scheduled broadcast in this time range.",
      content: {
        "application/json": {
          schema: { type: "object", $ref: "#/components/schemas/Error" },
        },
      },
    },
  },
};
