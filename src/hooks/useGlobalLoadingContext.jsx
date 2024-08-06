import { useContext } from "react";

import { GlobalLoadingContext } from "../context/GlobalLoadingContext";

export const useGlobalLoadingContext = () => {
  const context = useContext(GlobalLoadingContext);

  if (!context) {
    throw Error(
      "useGlobalLoadingContext must be used inside an GlobalLoadingContextProvider"
    );
  }

  return context;
};
