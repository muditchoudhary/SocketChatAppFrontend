import { useEffect, useState } from "react";
import { Input } from "@chakra-ui/react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
} from "@chakra-ui/react";

import backbg from "../assets/images/backbg.png";
import profile3 from "../assets/images/profile3.png";
import { BACKEND_URL } from "./globalConstatnt";
import { getConversations, initConversation } from "../apis/conversationApis";
import Conversation from "./Conversation";
import { onSendMessage } from "../apis/conversationApis";
import { socket } from "../socket";
import UserNameWithStatus from "./UserNameWithStatus";

function ViewChat() {
  const [friend, setFriend] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState();
  const [receiverId, setReceiverId] = useState();
  const [content, setContent] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);

  const params = useParams();
  // const { onlineUsers } = useOutletContext();

  const checkBlockStatus = async () => {
    const auth = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await fetch(
        `${BACKEND_URL}/user/getUser/${auth.user.id}`,
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsBlocked(data.blockedUsers.includes(params.id));
      } else {
        console.error("Failed to fetch block status");
      }
    } catch (error) {
      console.error("Failed to fetch block status", error);
    }
  };

  useEffect(() => {
    checkBlockStatus();
  }, []);

  const toggleBlockUser = async () => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const userIDtoggle = params.id;

    try {
      const response = await fetch(`${BACKEND_URL}/user/blockUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth.token}`,
        },
        body: JSON.stringify({
          userIdToToggle: userIDtoggle,
          userId: auth.user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setIsBlocked(!isBlocked);
      } else {
        alert("Failed to toggle block status.");
      }
    } catch (error) {
      alert("Failed to toggle block status.");
    }
  };

  async function onMessageSend(e) {
    console.log("running onMessageSend");
    e.preventDefault();
    const result = await onSendMessage(senderId, receiverId, content);
    const messageObj = result.message;
    socket.emit(
      "sendMessage",
      senderId,
      receiverId,
      messageObj,
      currentConversationId
    );
    setContent("");
  }

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("user"));
    const senderId = auth.user.id;
    const receiverId = params.id;
    setSenderId(senderId);
    setReceiverId(receiverId);
    const fetchConversations = async () => {
      try {
        const results = await getConversations(senderId, receiverId);
        console.log("conversations are: ", results);
        if (results.conversation !== null) {
          setCurrentConversationId(results.conversation._id);
          setMessages(results.conversation.messages);
        } else if (results.conversation === null) {
          const result = await initConversation(senderId, receiverId);
          setCurrentConversationId(result.newConversation._id);
          setMessages([]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConversations();
  }, [params.id]);

  useEffect(() => {
    const fetchSingleUser = async () => {
      try {
        const auth = JSON.parse(localStorage.getItem("user"));

        const response = await fetch(
          `${BACKEND_URL}/user/singleUser/${params.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${auth.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const results = await response.json();

        setFriend(results.result);
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };

    fetchSingleUser();
  }, [params.id]);

  useEffect(() => {
    const handleGetMessage = (message, givenConversationId) => {
      console.log(
        "givenConversationId: ",
        givenConversationId,
        currentConversationId
      );
      if (currentConversationId === givenConversationId) {
        console.log("new message is: ", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleGetUpdateMessages = (messages, givenConversationId) => {
      // console.log("new messages are: ", messages);
      if (currentConversationId === givenConversationId) {
        setMessages(messages);
      }
    };
    socket.on("getMessage", handleGetMessage);
    socket.on("getUpdateMessages", handleGetUpdateMessages);

    // Getting some weird bugs because of clean ups
    // I still don't understand why
    // return () => {
    //   socket.off("getMessage", handleGetMessage);
    //   socket.off("getUpdateMessages", handleGetUpdateMessages);

    //   console.log("getMessage event off and cleanup performed");
    //   console.log("getUpdateMessages event off and cleanup performed");
    // };
  }, [receiverId, currentConversationId]);

  const blockUser = async (currentStatus) => {
    try {
      setIsLoading(true);
      const auth = JSON.parse(localStorage.getItem("user"));

      if (!auth || !auth.token) {
        throw new Error("No auth token found");
      }

      const requestBody = {
        block: !currentStatus,
      };

      const response = await fetch(
        `${BACKEND_URL}/user/blockUser/${params.id}`,
        {
          method: "PUT",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Authorization: `${auth.token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Network response was not ok: ${response.status} - ${
            response.statusText
          }. Error: ${JSON.stringify(errorData)}`
        );
      }

      const result = await response.json();

      // Update the state with the new block status
      setFriend((prevFriend) => ({
        ...prevFriend,
        blockStatus: !currentStatus,
      }));
    } catch (error) {
      console.error("Fetch error: ", error);
      alert(`Failed to update user status. Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="personchats-right" style={{ backgroundImage: `url(${backbg})` }}>
        <div className="personchats-topprofile">
          <div className="myrow">
            <div className="my-col-11">
              <ul>
                <li>
                  <img src={profile3} alt="" />
                </li>
                <li>
                  <UserNameWithStatus
                    userName={friend.userName}
                    // isOnline={
                    //   onlineUsers && onlineUsers[friend.id] ? true : false
                    // }
                  />
                  <span>Typing....</span>
                </li>
              </ul>
            </div>
            <div className="col-md-1">
              <div className="blockdiv">
                <Popover>
                  <PopoverTrigger>
                    <Button>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton color="black" />
                    <PopoverBody color="black">
                      <button onClick={toggleBlockUser}>
                        {isBlocked ? "Unblock User" : "Block User"}
                      </button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <div className="chatcmn">
          <Conversation
            messages={messages}
            isLoading={isLoading}
            senderId={senderId}
            receiverId={receiverId}
            setMessages={setMessages}
            currentConversationId={currentConversationId}
          />
        </div>
        <div className="typing-input">
          <div className="myrow">
            <div className="my-col-10">
              <form onSubmit={onMessageSend}>
                <div className="myrow">
                  <div className="my-col-10">
                    <Input
                      placeholder="Type a message"
                      size="md"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                  <div className="my-col-2">
                    <button type="submit">
                      <i className="fa-regular fa-paper-plane"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewChat;
