import { useEffect, useState } from "react";

const UserNameWithStatus = ({
  userName,
  isOnline,
  recieverId,
  recieverBlockUsers,
  userBlockList,
}) => {
  let auth = JSON.parse(localStorage.getItem("user"));
  let user = auth.user;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h5 style={{ margin: 0 }}>{userName}</h5>
      {userBlockList?.includes(recieverId) ||
      recieverBlockUsers?.includes(user.id) ? null : (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill={isOnline ? "green" : "red"}
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginLeft: "8px" }}
        >
          <circle cx="5" cy="5" r="5" />
        </svg>
      )}
      {/* <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill={isOnline ? "green" : "red"}
        xmlns="http://www.w3.org/2000/svg"
        style={{ marginLeft: "8px" }}
      >
        <circle cx="5" cy="5" r="5" />
      </svg> */}
    </div>
  );
};

export default UserNameWithStatus;
