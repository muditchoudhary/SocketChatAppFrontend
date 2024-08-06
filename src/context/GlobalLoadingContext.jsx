import { createContext, useReducer, useEffect } from "react";

export const GlobalLoadingContext = createContext();

const globalLoadingReducer = (state, action) => {
  switch (action.type) {
    case "LOADING":
      return { isGlobalLoading: action.payload };
    case "NOT_LOADING":
      return { isGlobalLoading: action.payload };
    default:
      return state;
  }
};

export const GlobalLoadingContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalLoadingReducer, {
    isGlobalLoading: false,
  });

  return (
    <GlobalLoadingContext.Provider value={{ ...state, dispatch }}>
      {children}
    </GlobalLoadingContext.Provider>
  );
};
