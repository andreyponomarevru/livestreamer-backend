export const REQUEST_OPTIONS = {
  host: "localhost",
  port: 5000,
  path: "/api/v1/stream",
  method: "POST",
  headers: {
    "content-type": "audio/mpeg",
    "transfer-encoding": "chunked",
  },
};
