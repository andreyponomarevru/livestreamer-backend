/*
import { useReducer, useEffect, useState } from "react";

export type SelectItemsPerPage = {
  type: "SELECT_ITEMS_PER_PAGE";
  payload: { limit: number };
};
type SelectSort = { type: "SELECT_SORT"; payload: { sort: string } };
type ResetControls = { type: "RESET_CONTROLS" };
type SetCurrentPage = {
  type: "SET_CURRENT_PAGE";
  payload: number;
};
type SetPreviousPage = {
  type: "SET_PREVIOUS_PAGE";
  payload: string | null;
};
type SetNextPage = {
  type: "SET_NEXT_PAGE";
  payload: string | null;
};
type SetTotalCount = {
  type: "SET_TOTAL_COUNT";
  payload: number;
};

type Action =
  | SelectItemsPerPage
  | SelectSort
  | ResetControls
  | SetCurrentPage
  | SetPreviousPage
  | SetNextPage
  | SetTotalCount;
export type State = {
  sort: string;
  limit: number;
  currentPage: number;
  countPageItemsFrom: number;
  nextPage: string | null;
  previousPage: string | null;
  totalCount: number;
};

type Controls = {
  url: string;
  controls: State;
  resetControls: () => void;
  selectItemsPerPage: (itemsPerPage: SelectItemsPerPage["payload"]) => void;
  selectSort: (sortBy: string) => void;
  setCurrentPage: (currentPage: SetCurrentPage["payload"]) => void;
  setPreviousPage: (previousPage: SetPreviousPage["payload"]) => void;
  setNextPage: (nextPage: SetNextPage["payload"]) => void;
  setTotalCount: (totalCount: SetTotalCount["payload"]) => void;
};

//

function controlsReducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESET_CONTROLS":
      return {
        ...state,
        sort: state.sort || "year,desc",
        limit: state.limit || 100,

        currentPage: 1,
        countPageItemsFrom: 1,
        totalCount: 0,
        previousPage: null,
        nextPage: null,
      };

    case "SELECT_ITEMS_PER_PAGE":
      return {
        ...state,
        limit: action.payload.limit,
        currentPage: 1,
        countPageItemsFrom: 1,
      };

    case "SELECT_SORT":
      return { ...state, sort: action.payload.sort };

    case "SET_CURRENT_PAGE": {
      const countPageItemsFrom =
        action.payload > state.currentPage
          ? state.countPageItemsFrom + state.limit
          : state.countPageItemsFrom - state.limit;

      return { ...state, currentPage: action.payload, countPageItemsFrom };
    }

    case "SET_PREVIOUS_PAGE": {
      return { ...state, previousPage: action.payload };
    }

    case "SET_NEXT_PAGE": {
      return { ...state, nextPage: action.payload };
    }

    case "SET_TOTAL_COUNT": {
      return { ...state, totalCount: action.payload };
    }

    default:
      throw new Error();
  }
}

export function useControls(baseUrl: string): Controls {
  const initialState: State = {
    sort: "year,desc",
    limit: 100,

    currentPage: 1,
    countPageItemsFrom: 1,
    previousPage: null,
    nextPage: null,
    totalCount: 0,
  };

  const [url, setUrl] = useState(
    `${baseUrl}sort=${initialState.sort}&page=${initialState.currentPage}&limit=${initialState.limit}`
  );

  const [state, dispatch] = useReducer(controlsReducer, initialState);

  useEffect(() => {
    setUrl(
      `${baseUrl}sort=${state.sort}&page=${state.currentPage}&limit=${state.limit}`
    );
  }, [baseUrl, state]);

  // Reset controls when user switches between layouts: we need to reset "sort" key to default value 'year,desc' to prevent API request with invalid query params from select box
  const resetControls = () => {
    dispatch({ type: "RESET_CONTROLS" });
  };

  const selectSort = (sortBy: string) => {
    dispatch({ type: "SELECT_SORT", payload: { sort: sortBy } });
  };

  const selectItemsPerPage = (itemsPerPage: SelectItemsPerPage["payload"]) => {
    dispatch({ type: "SELECT_ITEMS_PER_PAGE", payload: itemsPerPage });
  };

  const setCurrentPage = (currentPage: SetCurrentPage["payload"]) => {
    dispatch({ type: "SET_CURRENT_PAGE", payload: currentPage });
  };

  const setPreviousPage = (previousPage: SetPreviousPage["payload"]) => {
    dispatch({ type: "SET_PREVIOUS_PAGE", payload: previousPage });
  };

  const setNextPage = (nextPage: SetNextPage["payload"]) => {
    dispatch({ type: "SET_NEXT_PAGE", payload: nextPage });
  };

  const setTotalCount = (totalCount: SetTotalCount["payload"]) => {
    dispatch({ type: "SET_TOTAL_COUNT", payload: totalCount });
  };

  return {
    url,
    controls: state,
    resetControls,
    selectItemsPerPage,
    selectSort,
    setCurrentPage,
    setPreviousPage,
    setNextPage,
    setTotalCount,
  };
}

*/
