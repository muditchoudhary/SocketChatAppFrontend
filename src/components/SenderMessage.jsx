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
import { toast } from "react-toastify";

function SenderMessage({
  message,
  setMessages,
  senderId,
  receiverId,
  currentConversationId,
}) {
  const [editContent, setEditContent] = useState(message.content);
  const [updateLoading, setUpdateLoading] = useState(true);
  const [isEditPopOverOpen, setIsEditPopOverOpen] = useState(false);
  const [isMsgPopOverOpen, setIsMsgPopOverOpen] = useState(false);

  async function onDeleteMessage(senderId, receiverId, messageId) {
    try {
      setUpdateLoading(true);

      socket.emit(
        "updateMessages",
        messageId,
        senderId,
        receiverId,
        null,
        currentConversationId,
        "deleted",
        (acknowledgement) => {
          if (acknowledgement && acknowledgement.success) {
            // maybe set some loading icon or status
            setUpdateLoading(false);
          } else {
            toast.error("Failed to delete message");
            setUpdateLoading(false);
          }
        }
      );
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      // setUpdateLoading(false);
    }
  }

  async function onEditMessage(e, senderId, receiverId, messageId, content) {
    e.preventDefault();
    if (!editContent || editContent.trim() === "") {
      toast.warning("Message must not be blank!");
      return;
    }
    try {
      setUpdateLoading(true);

      socket.emit(
        "updateMessages",
        messageId,
        senderId,
        receiverId,
        editContent.trim(),
        currentConversationId,
        "edited",
        (acknowledgement) => {
          if (acknowledgement && acknowledgement.success) {
            setUpdateLoading(false);
          } else {
            setUpdateLoading(false);
            toast.error("Failed to edit message");
          }
        }
      );
    } catch (error) {
      console.error(error);
      toast.error(error?.message);
    } finally {
      // setUpdateLoading(false);
      setIsEditPopOverOpen(false);
    }
  }

  return (
    <>
      <div className="mytext-right">
        {message.content}
        {!message.isDeleted && message.isEdited && " (edited)"}
        {!message.isDeleted && (
          <Popover
            isOpen={isMsgPopOverOpen}
            onClose={() => setIsMsgPopOverOpen(false)}
          >
            <PopoverTrigger>
              <Button onClick={() => setIsMsgPopOverOpen(true)}>
                <i className="fa-solid fa-ellipsis-vertical"></i>
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody>
                <Popover
                  isOpen={isEditPopOverOpen}
                  onClose={() => {
                    setIsEditPopOverOpen(false),
                      setEditContent(message.content);
                  }}
                >
                  <PopoverTrigger>
                    <button onClick={() => setIsEditPopOverOpen(true)}>
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
                  onClick={() => {
                    onDeleteMessage(senderId, receiverId, message._id);
                    setIsMsgPopOverOpen(false);
                  }}
                >
                  <i className="fa-solid fa-trash-can"></i> Delete
                </button>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </>
  );
}

export default SenderMessage;
