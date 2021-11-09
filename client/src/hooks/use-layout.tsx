/*
import { useState, useReducer } from "react";

type SetLayout = {
  type: "SET_LAYOUT";
  payload: LayoutType;
};

type Action = SetLayout;
export type State = {
  name: string;
  disableControls: boolean;
  disableSidebar: boolean;
};

type Layout = [State, (layout: LayoutType) => void];

function layoutReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LAYOUT": {
      const newLayout = action.payload;
      return {
        ...state,
        name: newLayout,
        disableSidebar:
          newLayout === "search" || newLayout === "grid" ? true : false,
        disableControls: newLayout === "search" ? true : false,
      };
    }

    default:
      throw new Error();
  }
}

export function useLayout(name: string): Layout {
  const initialState: State = {
    name: name,
    disableControls: false,
    disableSidebar: false,
  };

  const [state, dispatch] = useReducer(layoutReducer, initialState);

  const setLayout = (layout: LayoutType) => {
    dispatch({ type: "SET_LAYOUT", payload: layout });
  };

  return [state, setLayout];
}
*/
