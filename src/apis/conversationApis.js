import { BACKEND_URL } from "../components/globalConstatnt";
export async function getConversations(senderId, receiverId) {
  try {
    const queryParams = new URLSearchParams({
      senderId,
      receiverId,
    }).toString();
    const response = await fetch(
      `${BACKEND_URL}/conversation/get-conversation?${queryParams}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `${auth.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

export async function initConversation(senderId, receiverId) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/conversation//init-conversation`,
      {
        method: "POST",
        body: JSON.stringify({
          senderId,
          receiverId,
        }),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `${auth.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

export async function onSendMessage(senderId, receiverId, content) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/conversation/new-conversation`,
      {
        method: "POST",
        body: JSON.stringify({
          senderId,
          receiverId,
          content,
        }),
        headers: {
          "Content-Type": "application/json",
          // Authorization: `${auth.token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

export async function deleteMessage(senderId, receiverId, messageId) {
  try {
    const response = await fetch(`${BACKEND_URL}/conversation/delete-message`, {
      method: "DELETE",
      body: JSON.stringify({
        senderId,
        receiverId,
        messageId,
      }),
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}

export async function editMessage(senderId, receiverId, messageId, content) {
  try {
    const response = await fetch(`${BACKEND_URL}/conversation/edit-message`, {
      method: "PUT",
      body: JSON.stringify({
        senderId,
        receiverId,
        messageId,
        content,
      }),
      headers: {
        "Content-Type": "application/json",
        // Authorization: `${auth.token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error(error);
    throw new Error("Something went wrong");
  }
}
