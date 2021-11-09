import { APIError } from "../types";

async function handleResponseErr(err: Response): Promise<APIError | Error> {
  const contentType = err.headers.get("content-type");

  if (contentType && contentType.indexOf("application/json") !== -1) {
    const json: APIError = await err.json();
    return json;
  } else {
    const parsedErr = new Error(`${err.status} — ${err.statusText}}`);
    return parsedErr;
  }
}

export { handleResponseErr };
