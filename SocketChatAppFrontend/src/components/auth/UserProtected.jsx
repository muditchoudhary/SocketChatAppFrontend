import { Navigate } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useAuthContext } from "../../hooks/useAuthContext";

function UserProtected({ children }) {
  const { user } = useAuthContext();
  if (user === null) {
    return (
      <div className="loading-container w-full h-screen flex justify-center items-center fixed z-[1] bg-white bg-opacity-90">
        <HashLoader color="#1D3557" />
      </div>
    );
  }

  if (user === false) {
    return <Navigate to="/login" replace />;
  } else {
    <Navigate to="/chat" replace />;
  }
}

export default UserProtected;
