export const getStream = {
  summary: "Returns the audio stream of a current broadcast (if available).",

  responses: {
    "200": {
      headers: {
        "cache-control": { schema: { type: "string" } },
        "content-type": { schema: { type: "string" } },
        "transfer-encoding": { schema: { type: "string" } },
        pragma: { schema: { type: "string" } },
        expires: { schema: { type: "number" } },
      },
      content: {
        "audio/mpeg": { schema: { type: "string", format: "binary" } },
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
