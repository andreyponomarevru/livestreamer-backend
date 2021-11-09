export type ParsedResponse<T> = {
  status: number;
  body: T | null;
};

async function parseResponse<T>(
  response: Response
): Promise<ParsedResponse<T>> {
  const contentType = response.headers.get("content-type");

  console.log("[parseResponse] ", response);

  if (contentType && contentType.indexOf("application/json") !== -1) {
    if (response.ok) {
      return { body: await response.json(), status: response.status };
    } else {
      throw response;
    }
  } else {
    if (response.ok) {
      return { body: null, status: response.status };
    } else {
      throw response;
    }
  }
}

export { parseResponse };
