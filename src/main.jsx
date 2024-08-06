import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import "./index.css";
import "./responsive.css"
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { GlobalLoadingContextProvider } from "./context/GlobalLoadingContext.jsx";
import GlobalLoader from "./components/GlobalLoader.jsx";

// import { MessageContextProvider } from "./context/Messagecontext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <AuthContextProvider>
      <GlobalLoadingContextProvider>
        <GlobalLoader>
          <App />
        </GlobalLoader>
      </GlobalLoadingContextProvider>
      <ToastContainer />
    </AuthContextProvider>
  </>
);
