export const getSchedule = {
  summary: "Returns all scheduled broadcasts.",

  responses: {
    "200": {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              results: {
                type: "array",
                items: { $ref: "#/components/schemas/ScheduledBroadcast" },
              },
            },
          },
        },
      },
    },
  },
};
