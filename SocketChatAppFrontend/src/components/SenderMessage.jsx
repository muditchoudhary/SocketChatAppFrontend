import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Input,
  PopoverHeader,
} from "@chakra-ui/react";
import { socket } from "../socket";

import { deleteMessage, editMessage } from "../apis/conversationApis";
import { useState } from "react";

function SenderMessage({
  message,
  setMessages,
  senderId,
  receiverId,
  currentConversationId,
}) {
  async function onDeleteMessage(senderId, receiverId, messageId) {
    const result = await deleteMessage(senderId, receiverId, messageId);
    socket.emit(
      "updateMessages",
      senderId,
      receiverId,
      result.messages,
      currentConversationId
    );
  }

  async function onEditMessage(e, senderId, receiverId, messageId, content) {
    e.preventDefault();
    const result = await editMessage(senderId, receiverId, messageId, content);
    socket.emit(
      "updateMessages",
      senderId,
      receiverId,
      result.messages,
      currentConversationId
    );
  }

  const [editContent, setEditContent] = useState(message.content);

  return (
    <>
      <div className="mytext-right">
        {message.content}
        <Popover>
          <PopoverTrigger>
            <Button>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody>
              <Popover>
                <PopoverTrigger>
                  <button
                  // onClick={() =>
                  //   onEditMessage(senderId, receiverId, message._id, content)
                  // }
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Edit
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader>
                    <PopoverCloseButton padding="0px" />
                  </PopoverHeader>
                  <PopoverBody>
                    <form
                      onSubmit={(e) =>
                        onEditMessage(
                          e,
                          senderId,
                          receiverId,
                          message._id,
                          editContent
                        )
                      }
                    >
                      <Input
                        placeholder="Type a message"
                        size="md"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                      />
                    </form>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <br />
              <button
                onClick={() =>
                  onDeleteMessage(senderId, receiverId, message._id)
                }
              >
                <i className="fa-solid fa-trash-can"></i> Delete
              </button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
}

export default SenderMessage;
