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
import { BACKEND_URL } from "./globalConstatnt";
import { getConversations, initConversation } from "../apis/conversationApis";
import Conversation from "./Conversation";
import { onSendMessage } from "../apis/conversationApis";
import { socket } from "../socket";
import UserNameWithStatus from "./UserNameWithStatus";

function ViewChat() {
  const [friend, setFriend] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState();
  const [receiverId, setReceiverId] = useState();
  const [content, setContent] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [sendMessageLoading, setSendMessageLoading] = useState(false);

  const endMessage = useRef(null);

  const params = useParams();
  // const { onlineUsers } = useOutletContext();

  async function onMessageSend(e) {
    e.preventDefault();
    try {
      setSendMessageLoading(true);
      console.log("content is: ", content);
      content.trim();
      if (!content || content.trim() === "") {
        toast.warning("Message can't be blank");
        setSendMessageLoading(false);
        setContent("");
        return;
      }
      console.log("running onMessageSend");

      await new Promise((resolve, reject) => {
        socket.emit(
          "sendMessage",
          senderId,
          receiverId,
          content.trim(),
          currentConversationId,
          ({ acknowledgement }) => {
            if (acknowledgement && acknowledgement.success) {
              console.log("acknowledgement: ", acknowledgement);
              setSendMessageLoading(false);
              resolve();
            } else {
              reject(new Error("Failed to send message"));
              setSendMessageLoading(false);
            }
          }
        );
      });
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
        await new Promise((resolve, reject) => {
          socket.emit(
            "wantConversations",
            { senderId, receiverId },
            async ({ acknowledgement }) => {
              if (acknowledgement && acknowledgement.conversation) {
                console.log(
                  "fetched conversation is: ",
                  acknowledgement.conversation
                );
                setCurrentConversationId(acknowledgement.conversation._id);
                setMessages(acknowledgement.conversation.messages);
                resolve();
              } else {
                reject();
              }
            }
          );
        });
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

  const scrollToBottom = () => {
    endMessage.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleGetMessage = (message, givenConversationId) => {
      console.log("givenConversationId: ", givenConversationId);
      console.log("currentConversationId: ", currentConversationId);
      if (
        currentConversationId &&
        currentConversationId === givenConversationId
      ) {
        console.log("new message is: ", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    };

    const handleGetUpdateMessages = (messages, givenConversationId) => {
      // console.log("new messages are: ", messages);
      if (
        currentConversationId &&
        currentConversationId === givenConversationId
      ) {
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
  }, [currentConversationId]);

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
                      <button>Block</button>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <div className="chatcmn" style={{ backgroundImage: `url(${backbg})` }}>
          {isLoading ? (
            <h1>Will show Skeleton here</h1>
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
                      disabled={sendMessageLoading}
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
                      <button type="submit">
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
