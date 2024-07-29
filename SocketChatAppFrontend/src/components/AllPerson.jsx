import { useEffect, useState } from "react";
import profile from "../assets/images/profile.png";
import { Input } from "@chakra-ui/react";
import { BACKEND_URL } from "./globalConstatnt";
import { useNavigate } from "react-router-dom";
import UserNameWithStatus from "./UserNameWithStatus";

function AllPerson({ onlineUsers }) {
  const [allUser, setAllUser] = useState([]);
  const [logged, setLogged] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const auth = JSON.parse(localStorage.getItem("user"));
      if (auth && auth.user) {
        setLogged(auth.user);

        const response = await fetch(`${BACKEND_URL}/user/getUser`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`, // Add your token here if needed
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const results = await response.json();

        if (results.message === "Users fetched") {
          // Filter out the logged-in user
          const filteredUsers = results.allUser.filter(
            (user) => user._id !== auth.user.id
          );

          setAllUser(filteredUsers);
          console.log("filtered users are: ", filteredUsers);
        } else {
          console.error("Failed to fetch users:", results.message);
        }
      } else {
        throw new Error("No auth token found");
      }
    } catch (error) {
      console.error("Fetch error: ", error);
      // Optionally navigate to login page if auth fails
      // navigate('/login');
    }
  }

  const navigateChat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <>
      <div className="person-search">
        <Input placeholder="Search Person" size="md" />
      </div>
      <div className="chatleft-allperson">
        {allUser.map((item, index) => (
          <div
            className="person-chats"
            key={index}
            onClick={() => navigateChat(item._id)}
          >
            <ul>
              <li>
                <img src={profile} alt="" />
              </li>
              <li>
                <UserNameWithStatus
                  userName={item.userName}
                  isOnline={onlineUsers && onlineUsers[item._id] ? true : false}
                />
                <span>seen</span>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default AllPerson;
