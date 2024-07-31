import ReceiverMessage from "./ReceiverMessage";
import SenderMessage from "./SenderMessage";

function Conversation({
  messages,
  isLoading,
  senderId,
  receiverId,
  setMessages,
  currentConversationId,
}) {
  return (
    <>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        messages.map((msg) => {
          if (msg.author_id === senderId) {
            return (
              <SenderMessage
                message={msg}
                setMessages={setMessages}
                senderId={senderId}
                receiverId={receiverId}
                key={msg._id}
                currentConversationId={currentConversationId}
              />
            );
          } else if (msg.author_id === receiverId) {
            return <ReceiverMessage message={msg} key={msg._id} />;
          }
        })
      )}
    </>
  );
}

export default Conversation;
