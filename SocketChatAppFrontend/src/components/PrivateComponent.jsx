import { Navigate, Outlet } from "react-router-dom";

const PrivateComponent = () => {
  const auth = JSON.parse(localStorage.getItem("user"));

  return auth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateComponent;
