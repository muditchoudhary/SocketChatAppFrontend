import { useEffect, useState, useRef } from "react";
import profile from "../assets/images/profile.png";
import { Input, SkeletonCircle, Skeleton, Box } from "@chakra-ui/react";

import blockProfile from "../assets/images/blockProfile.jpg";

import { BACKEND_URL } from "./globalConstatnt";
import { Await, useNavigate } from "react-router-dom";
import UserNameWithStatus from "./UserNameWithStatus";

import { socket } from "../socket";

function AllPerson({ onlineUsers, allUser, userBlockList }) {
  const skeltonArr = new Array(8).fill(1);
  // const [allUser, setAllUser] = useState([]);
  const [logged, setLogged] = useState(null);
  const [user, setUser] = useState("");

  let auth = JSON.parse(localStorage.getItem("user"));

  const endUser = useRef(null);

  const navigate = useNavigate();

  // Effect for, all users that are in db
  // useEffect(() => {
  //   const auth = JSON.parse(localStorage.getItem("user"));
  //   socket.on("getAllUsers", ({ fetchedAllUsers }) => {
  //     // Filter out the logged-in user
  //     const filteredUsers = fetchedAllUsers.filter(
  //       (user) => user._id !== auth.user.id
  //     );
  //     setAllUser(filteredUsers);
  //   });
  // }, []);

  const scrollToBottom = () => {
    endUser.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [allUser]);

  const navigateChat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <>
      {/* <div className="person-search">
        <Input placeholder="Search Person" size="md" />
      </div> */}
      <div className="chatleft-allperson">
        {!allUser || allUser.length === 0 ? (
          <Box boxShadow="lg" bg="white" display="flex" flexDirection="column">
            {skeltonArr.map((elm, index) => (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="space-around"
                alignItems="center"
                margin="5px"
                marginY="25px"
                key={index}
              >
                <SkeletonCircle size="10" />
                <Skeleton height="25px" width="80%" border="2px solid blue" />
              </Box>
            ))}
          </Box>
        ) : (
          allUser.map((item, index) => (
            <div
              className="person-chats"
              key={index}
              onClick={() => navigateChat(item._id)}
            >
              <ul>
                <li>
                  {userBlockList?.includes(item._id) ||
                  item.blockedUsers?.includes(auth.user.id) ? (
                    <img src={blockProfile} alt="" />
                  ) : (
                    <img src={profile} alt="" />
                  )}
                </li>
                <li>
                  <UserNameWithStatus
                    userName={item.userName}
                    isOnline={
                      onlineUsers && onlineUsers[item._id] ? true : false
                    }
                    recieverId={item._id}
                    recieverBlockUsers={item.blockedUsers}
                    userBlockList={userBlockList}
                  />
                </li>
              </ul>
            </div>
          ))
        )}
        <div ref={endUser} />
      </div>
    </>
  );
}

export default AllPerson;
