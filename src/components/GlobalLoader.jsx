import { useGlobalLoadingContext } from "../hooks/useGlobalLoadingContext";
import { HashLoader } from "react-spinners";

import "../loader.css";

function GlobalLoader({ children }) {
  const { isGlobalLoading } = useGlobalLoadingContext();
  return (
    <>
      {isGlobalLoading && (
        <div className="loading-container">
          <HashLoader color="#1D3557" />
        </div>
      )}
      {children}
    </>
  );
}

export default GlobalLoader;
