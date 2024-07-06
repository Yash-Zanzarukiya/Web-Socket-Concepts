import axios from "axios";
import React, { useState } from "react";

function Message({ message, setErrMessage, setMessages }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const inputRef = React.useRef();

  const updateMessage = async (id, content) => {
    setErrMessage("");
    try {
      await axios.patch(`http://localhost:3000/api/messages/${message.id}`, { content });
    } catch (error) {
      setErrMessage(error.response.data.message);
    }
  };

  const deleteMessage = async (id) => {
    setErrMessage("");
    try {
      await axios.delete(`http://localhost:3000/api/messages/${message.id}`);
    } catch (error) {
      setErrMessage(error.response.data.message);
    }
  };

  console.log("message: ", message);

  return (
    <div className="message">
      {isUpdating && (
        <input
          type="text"
          ref={inputRef}
          autoFocus={true}
          style={{
            width: "400px",
            marginRight: "20px",
            backgroundColor: "transparent",
            outline: "none",
            border: "none",
            fontSize: "larger",
          }}
          defaultValue={message.content}
        />
      )}
      {!isUpdating && (
        <span
          style={{
            width: "400px",
            textAlign: "left",
            marginRight: "20px",
            fontSize: "larger",
          }}
        >
          {message.content}
        </span>
      )}
      <span className="buttons">
        <button onClick={() => deleteMessage(message.id)} className="delete-button">
          Delete
        </button>
        <button
          onClick={() => {
            setIsUpdating((pre) => !pre);
            if (isUpdating && inputRef.current.value !== message.content) {
              updateMessage(message.id, inputRef.current.value);
            }
          }}
          style={{ minWidth: "75px" }}
        >
          {isUpdating ? "Update" : "Edit"}
        </button>
      </span>
    </div>
  );
}

export default Message;
