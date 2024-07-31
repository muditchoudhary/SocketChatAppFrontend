import { useState } from "react";
import { Input } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/logo.png";
import { BACKEND_URL } from "./globalConstatnt";
import { toast } from "react-toastify";
import { useAuthContext } from "../hooks/useAuthContext";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const submitLogin = async (e) => {
    e.preventDefault();

    console.log(userName, password);
    try {
      let response = await fetch(`${BACKEND_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify({
          userName: userName,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.message == "Incorrect password") {
        toast.error("Incorrect Password");
        return;
      }

      if (result) {
        localStorage.setItem("user", JSON.stringify(result));
        dispatch({ type: "LOGIN", payload: result.user });

        toast.success("Welcome " + result.user.userName);
        navigate("/chat");
      }
    } catch (error) {
      console.error("There was an error during the fetch operation:", error);
      toast.error("An error occurred. Please try again.");
    }
  };
  return (
    <>
      <div className="login-card">
        <br />
        <br />
        <form onSubmit={submitLogin}>
          <div className="login-cardlogo">
            <img src={logo} alt="" />
          </div>
          <div className="logincard-input">
            <label htmlFor="">Username</label>
            <Input
              type="text"
              placeholder="Username"
              size="md"
              onChange={(e) => {
                setUserName(e.target.value);
              }}
              pattern="[A-Za-z ]+"
              title="Fill the Name only"
              required
            />
          </div>
          <div className="logincard-input">
            <label htmlFor="">Password</label>
            <Input
              minLength={8}
              maxLength={10}
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="Password"
              size="md"
              required
            />
          </div>
          <br />
          <Button type="submit">Submit</Button>
        </form>
      </div>
    </>
  );
}

export default Login;
