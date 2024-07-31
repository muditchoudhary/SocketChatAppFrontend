import { createContext, useReducer, useEffect } from "react";

export const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: action.payload };
    case "NOT_FOUND": {
      return { user: action.payload };
    }
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const userLocalStorage = JSON.parse(localStorage.getItem("user"));

    if (userLocalStorage === null) {
      dispatch({ type: "NOT_FOUND", payload: false });
    }
    if (userLocalStorage) {
      dispatch({ type: "LOGIN", payload: userLocalStorage.user });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
