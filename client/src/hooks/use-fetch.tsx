import { useReducer } from "react";
import { parseResponse } from "../utils/parse-response";
import { useIsMounted } from "./use-is-mounted";
import { handleResponseErr } from "../utils/handle-response-err";
import { ParsedResponse } from "../utils/parse-response";

interface APIResponse<Results> {
  error: APIError | null;
  isLoading: boolean;
  response: ParsedResponse<Results> | null;
}

type APIError = {
  message: string;
  moreInfo: string;
  status: number;
};

type FetchInit = {
  type: "FETCH_INIT";
};
type FetchSuccess<T> = {
  type: "FETCH_SUCCESS";
  payload: APIResponse<T>["response"];
};
type FetchFailure<T> = {
  type: "FETCH_FAILURE";
  error: APIResponse<T>["error"] | Error;
};

type Action<T> = FetchInit | FetchSuccess<T> | FetchFailure<T>;
type State<T> = {
  isLoading: boolean;
  error: null | Error | APIResponse<T>["error"];
  response: null | APIResponse<T>["response"];
};

//

// We need this wrapping function only to pass the data type to the reducer
function createDataFetchReducer<T>() {
  // This is is the actual reducer function
  return function (state: State<T>, action: Action<T>): State<T> {
    switch (action.type) {
      case "FETCH_INIT":
        return { ...state, isLoading: true, error: null };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          error: null,
          response: action.payload,
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          error: action.error,
        };
      default:
        throw new Error();
    }
  };
}

export function useFetch<ResponseBody>(): [
  State<ResponseBody>,
  (url: RequestInfo, request?: RequestInit) => Promise<void>
] {
  const initialState: State<ResponseBody> = {
    isLoading: false,
    error: null,
    response: null,
  };

  const dataFetchReducer = createDataFetchReducer<ResponseBody>();

  const [state, dispatch] = useReducer(dataFetchReducer, initialState);

  const isMounted = useIsMounted();

  async function fetchNow(url: RequestInfo, request?: RequestInit) {
    dispatch({ type: "FETCH_INIT" });

    let res: Response;

    try {
      res = await fetch(url, request);
    } catch {
      if (isMounted) {
        dispatch({
          type: "FETCH_FAILURE",
          error: new Error("Network error"),
        });
      }
      return;
    }

    try {
      const resBody = await parseResponse<ResponseBody>(res);
      console.log("[useFetch] Response body:", resBody);

      if (isMounted) {
        dispatch({ type: "FETCH_SUCCESS", payload: resBody });
      }
    } catch (err) {
      console.log("ERROR CAUGHT :::::::::::::::::", err);
      const parsedErr = await handleResponseErr(err as Response);
      dispatch({
        type: "FETCH_FAILURE",
        error: parsedErr,
      });
    }
  }

  return [state as APIResponse<ResponseBody>, fetchNow];
}
