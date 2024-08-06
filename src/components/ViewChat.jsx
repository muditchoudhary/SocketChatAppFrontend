import { useEffect, useState, useRef } from "react";
import { Box, Input } from "@chakra-ui/react";
import { useOutletContext, useParams } from "react-router-dom";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { toast } from "react-toastify";

import backbg from "../assets/images/backbg.png";
import profile3 from "../assets/images/profile3.png";
import blockProfile from "../assets/images/blockProfile.jpg";
import { BACKEND_URL } from "./globalConstatnt";
import { getConversations, initConversation } from "../apis/conversationApis";
import Conversation from "./Conversation";
import { onSendMessage } from "../apis/conversationApis";
import { socket } from "../socket";
import UserNameWithStatus from "./UserNameWithStatus";

function ViewChat() {
  const [friend, setFriend] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState();
  const [receiverId, setReceiverId] = useState();
  const [content, setContent] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const [isFriendTyping, setIsFriendTyping] = useState(false);

  const endMessage = useRef(null);

  const params = useParams();
  const { onlineUsers, allUser, userBlockList } = useOutletContext();
  let timeout;

  function timeoutFunction() {
    socket.emit("typing", {
      senderId,
      receiverId,
      currentConversationId,
      isTyping: true,
    });
  }

  const auth = JSON.parse(localStorage.getItem("user"));

  const toggleBlockUser = () => {
    try {
      socket.emit(
        "toggleBlock",
        { senderId: senderId, receiverId: receiverId },
        ({ acknowledgement }) => {
          // if (acknowledgement.success === true) {
          //to be done later
          // }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  function handleTypingStatus(e) {
    socket.emit("typing", {
      senderId,
      receiverId,
      currentConversationId,
      isTyping: true,
    });
    clearTimeout(timeout);
    timeout = setTimeout(timeoutFunction, 3000);
  }
  async function onMessageSend(e) {
    e.preventDefault();
    try {
      setSendMessageLoading(true);

      if (
        userBlockList?.includes(receiverId) ||
        friend.blockedUsers?.includes(auth.user.id)
      ) {
        toast.warning("Blocked can't send message");
        setSendMessageLoading(false);
        setContent("");
        return;
      }
      content.trim();
      if (!content || content.trim() === "") {
        toast.warning("Message can't be blank");
        setSendMessageLoading(false);
        setContent("");
        return;
      }

      socket.emit(
        "sendMessage",
        senderId,
        receiverId,
        content.trim(),
        currentConversationId,
        ({ acknowledgement }) => {
          if (acknowledgement && acknowledgement.success) {
            setSendMessageLoading(false);
          } else {
            toast.error("Failed to send message");
            setSendMessageLoading(false);
          }
        }
      );
    } catch (error) {
      toast.error(error?.message);
    }
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
        setIsLoading(true);
        socket.emit(
          "wantConversations",
          { senderId, receiverId },
          ({ acknowledgement }) => {
            if (acknowledgement && acknowledgement.conversation) {
              setCurrentConversationId(acknowledgement.conversation._id);
              setMessages(acknowledgement.conversation.messages);
              setIsLoading(false);
            }
          }
        );
      } catch (error) {
        console.error(error);
      }
    };
    fetchConversations();
  }, [params.id]);

  useEffect(() => {
    const handleGetMessage = (message, givenConversationId) => {
      if (
        currentConversationId &&
        currentConversationId === givenConversationId
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleGetUpdateMessages = (messages, givenConversationId) => {
      if (
        currentConversationId &&
        currentConversationId === givenConversationId
      ) {
        setMessages(messages);
      }
    };

    const userTyping = ({ isTyping, givenConversationId }) => {
      if (currentConversationId === givenConversationId) {
        setIsFriendTyping(isTyping);
      }
    };

    const handleSingleUser = ({ getSingleUserDetails }) => {
      setFriend(getSingleUserDetails);
    };

    socket.on("getMessage", handleGetMessage);
    socket.on("getUpdateMessages", handleGetUpdateMessages);
    socket.on("userTyping", userTyping);

    // socket.on("fetchUserBlockList", handleUserBlockList);
    socket.on("getSingleUser", handleSingleUser);

    if (receiverId) {
      socket.emit(
        "singleUser",
        { receiverId: receiverId, senderId: senderId },
        ({ acknowledgement }) => {
          // if (acknowledgement.success === true) {
          //   console.log("trye");
          //to done later
          // }
        }
      );
    }

    // Getting some weird bugs because of clean ups
    // I still don't understand why
    // return () => {
    //   socket.off("getMessage", handleGetMessage);
    //   socket.off("getUpdateMessages", handleGetUpdateMessages);

    //   console.log("getMessage event off and cleanup performed");
    //   console.log("getUpdateMessages event off and cleanup performed");
    // };
  }, [currentConversationId]);

  useEffect(() => {
    if (userBlockList?.includes(friend._id)) {
      setIsBlocked(true);
    } else {
      setIsBlocked(false);
    }
  }, [userBlockList, friend]);

  return (
    <>
      <div className="personchats-right">
        <div className="personchats-topprofile">
          <div className="myrow">
            <div className="my-col-11">
              <ul>
                <li>
                  {userBlockList?.includes(friend._id) ||
                  friend.blockedUsers?.includes(auth.user.id) ? (
                    <>
                      <img src={blockProfile} alt="" />
                    </>
                  ) : (
                    <>
                      <img src={profile3} alt="" />
                    </>
                  )}
                </li>
                <li>
                  <>
                    {console.log("friend: ", friend)}
                    {console.log("userBlockList: ", userBlockList)}

                    <UserNameWithStatus
                      userName={friend.userName}
                      isOnline={
                        onlineUsers && onlineUsers[friend._id] ? true : false
                      }
                      recieverId={friend._id}
                      recieverBlockUsers={friend.blockedUsers}
                      userBlockList={userBlockList}
                    />
                  </>
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

        <div className="chatcmn" style={{ backgroundImage: `url(${backbg})` }}>
          {isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              <Conversation
                messages={messages}
                isLoading={isLoading}
                senderId={senderId}
                receiverId={receiverId}
                setMessages={setMessages}
                currentConversationId={currentConversationId}
              />
              <div ref={endMessage} />
            </>
          )}
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
                      disabled={sendMessageLoading || isBlocked}
                      onKeyUp={handleTypingStatus}
                    />
                  </div>
                  <div className="my-col-2">
                    {sendMessageLoading ? (
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        height="100%"
                        marginX="8px"
                      >
                        <Spinner size="xs" />
                      </Box>
                    ) : (
                      <button type="submit" disabled={isBlocked}>
                        <i className="fa-regular fa-paper-plane"></i>
                      </button>
                    )}
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
