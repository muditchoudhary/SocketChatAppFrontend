import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

import AllPerson from "./AllPerson";
import { socket } from "../socket";
import { useAuthContext } from "../hooks/useAuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import profile2 from "../assets/images/profile2.png";

function Chat() {
  const auth = JSON.parse(localStorage.getItem("user"));
  const { user } = useAuthContext();
  const [onlineUsers, setOnlineUsers] = useState(null);
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const onLogOut = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT", payload: false });
    navigate("/");
  };

  useEffect(() => {
    if (user) {
      socket.connect();

      const handleConnect = () => {
        console.log("socket connected successfully, socket id is: ", socket.id);

        socket.emit("addUser", socket.id, user.id, user.userName);

        // socket.on("getUsers", (users) => {
        //   setOnlineUsers(users);
        //   console.log("online users are: ", users);
        // });
      };

      socket.on("connect", handleConnect);

      //   Turning off because when we shift to chat/:id the
      //   effect cleans up i think due to that socket connection get lost
      return () => {
        socket.off("connect", handleConnect);

        socket.disconnect();

        console.log("Socket disconnected and cleanup performed");
      };
    }
  }, [user]);

  useEffect(() => {
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
      console.log("online users are: ", users);
    });
  }, []);

  return (
    <>
      <section>
        <div className="home-wp">
          <div className="mycontainer">
            <div className="home-sec">
              <div className="myrow">
                <div className="my-col-3 leftchat-profile">
                  <div className="chatleft">
                    <div className="chatleft-myprofile">
                      <Menu>
                        <MenuButton>
                          <ul>
                            <li>
                              <img src={profile2} alt="" />
                            </li>
                            <li>
                              <h5>{auth.user.userName}</h5>
                            </li>
                          </ul>
                        </MenuButton>
                        <MenuList>
                          <MenuItem color="black" onClick={onLogOut}>
                            Log out
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </div>
                    <AllPerson onlineUsers={onlineUsers} />
                  </div>
                </div>
                <div className="my-col-9 person-chatright">
                  <Outlet context={{ onlineUsers }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Chat;
