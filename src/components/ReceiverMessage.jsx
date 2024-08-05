function ReceiverMessage({ message }) {
  return (
    <>
      <div className="mytext-left">
        {message.content}
        {!message.isDeleted && message.isEdited && " (edited)"}
      </div>
    </>
  );
}

export default ReceiverMessage;
