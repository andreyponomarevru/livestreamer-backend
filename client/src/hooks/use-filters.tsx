/*

import { useState, useEffect, useReducer } from "react";

const { REACT_APP_API_ROOT } = process.env;
const TRACKS_API_URL = `${REACT_APP_API_ROOT}/tracks`;

export type Filter = { filter: string; id: number };

type ToggleFilter = { type: "TOGGLE_FILTER"; payload: Filter };
type ResetFilter = { type: "RESET_FILTER"; payload: string };

type Action = ToggleFilter | ResetFilter;
export type State = { [key: string]: number[] };

type UseFilters = [
  State,
  string,
  ({ filter, id }: Filter) => void,
  (filter: string) => void
];

//

function filtersReducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE_FILTER": {
      const filterName = action.payload.filter;
      const clickedFilterId = action.payload.id;

      if (state[filterName].includes(clickedFilterId)) {
        const filteredIds = state[filterName].filter(
          (id) => id !== clickedFilterId
        );
        return { ...state, [filterName]: filteredIds };
      } else {
        return {
          ...state,
          [filterName]: [...state[filterName], clickedFilterId],
        };
      }
    }

    case "RESET_FILTER": {
      const filterName = action.payload;
      return { ...state, [filterName]: [] };
    }

    default:
      throw new Error();
  }
}

export function useFilters(): UseFilters {
  const initialState: State = {
    years: [],
    genres: [],
    labels: [],
    artists: [],
  };
  const [state, dispatch] = useReducer(filtersReducer, initialState);
  const [query, setQuery] = useState(new Set<string>());
  const [url, setUrl] = useState(`${TRACKS_API_URL}`);

  function buildQueryString(): Set<string> {
    const newQuery = new Set<string>();
    for (const key in state) {
      if (state[key].length > 0) {
        const filterIds = state[key];
        filterIds.forEach((id) => newQuery.add(`${key}[]=${id}`));
      }
    }
    return newQuery;
  }

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setQuery(buildQueryString());
    }

    return () => {
      isMounted = false;
    };
  }, [state]);

  useEffect(() => {
    setUrl(
      `${TRACKS_API_URL}${
        query.size > 0 ? `?${Array.from(query).join("&")}&` : "?"
      }`
    );
  }, [query]);

  const resetFilter = function (filter: string) {
    let isFilterApplied = false;
    if (state[filter] && state[filter].length > 0) isFilterApplied = true;

    if (isFilterApplied) {
      dispatch({ type: "RESET_FILTER", payload: filter });
    }
  };

  const toggleFilter = function ({ filter, id }: Filter) {
    dispatch({ type: "TOGGLE_FILTER", payload: { filter, id } });
  };

  useEffect(() => {
    console.log(url);
  }, [state]);

  return [state, url, toggleFilter, resetFilter];
}

*/
