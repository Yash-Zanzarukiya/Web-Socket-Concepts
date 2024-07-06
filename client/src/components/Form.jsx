import React, { useState } from "react";
import { icons } from "./icons.jsx";
import axios from "axios";

function Form({ setErrMessage }) {
  const [loading, setLoading] = useState(false);

  const inputRef = React.useRef();

  const sendMessage = async (content) => {
    setErrMessage("");
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/messages", { content });
      inputRef.current.value = "";
    } catch (error) {
      setErrMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <input
          type="text"
          ref={inputRef}
          style={{ padding: "11px", width: "400px", marginRight: "20px" }}
          placeholder="Enter the message"
        />
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (inputRef.current.value) sendMessage(inputRef.current.value);
          }}
          disabled={loading}
          style={{
            padding: "12px 20px",
            fontSize: "larger",
          }}
        >
          {loading ? <span>{icons.loading}</span> : "Send"}
        </button>
      </form>
    </div>
  );
}

export default Form;
