import { useEffect, useState } from "react";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

import AllPerson from "./AllPerson";
import { socket } from "../socket";
import { useAuthContext } from "../hooks/useAuthContext";
import { Outlet, useNavigate } from "react-router-dom";
import profile2 from "../assets/images/profile2.png";

import { useMediaQuery } from "react-responsive";

function Chat() {
  const isMobileOrTable = useMediaQuery({
    query: "(max-width: 800px)",
  });

  const [allUser, setAllUser] = useState([]);
  const [userBlockList, setUserBlockList] = useState([]);

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
    const handleUserBlockList = ({ fetchUserBlockArray }) => {
      setUserBlockList(fetchUserBlockArray);
    };

    socket.on("fetchUserBlockList", handleUserBlockList);
  });

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    socket.on("getAllUsers", ({ fetchedAllUsers }) => {
      // Filter out the logged-in user
      const filteredUsers = fetchedAllUsers.filter(
        (user) => user._id !== auth.user.id
      );
      setAllUser(filteredUsers);
    });
  }, []);

  // Effect for, when a new user login and becomes online
  useEffect(() => {
    if (user) {
      socket.connect();
      const handleConnect = () => {
        socket.emit("addUser", user.id, user.userName);
      };

      socket.on("connect", handleConnect);

      return () => {
        socket.off("connect", handleConnect);
        socket.disconnect();
      };
    }
  }, [user]);

  // Effect for, get all online users present in server
  useEffect(() => {
    socket.on("getUsers", (users) => {
      setOnlineUsers(users);
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
                    <AllPerson
                      onlineUsers={onlineUsers}
                      allUser={allUser}
                      userBlockList={userBlockList}
                    />
                  </div>
                </div>
                <div className="my-col-9 person-chatright">
                  {/* RESPONSIVE LOGIC NOT ABLE TO COMPLETE MAY BE LETTER */}
                  {/* {!isMobileOrTable && <Outlet context={{ onlineUsers }} />} */}
                  <Outlet context={{ onlineUsers, allUser, userBlockList }} />
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
