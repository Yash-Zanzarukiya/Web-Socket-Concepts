import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import Form from "./components/Form";
import Message from "./components/Message";
import axios from "axios";
import { socket } from "./socket";

function App() {
  const [messages, setMessages] = useState([]);
  const [errMessage, setErrMessage] = useState("");

  const fetchMessages = async () => {
    setErrMessage("");
    try {
      const { data } = await axios.get("http://localhost:3000/api/messages");
      setMessages((pre) => [...data.data]);
    } catch (error) {
      setErrMessage(error.response.data.message);
    }
  };

  useEffect(() => {
    fetchMessages();
    socket.on("message", (res) => {
      const message = res.data;

      if (res.action === "CREATED") {
        setMessages((prev) => [...prev, message]);
      } else if (res.action === "UPDATED") {
        setMessages((pre) => {
          const updatedArray = [...pre];
          console.log("updatedArray: ", updatedArray);
          console.log("message: ", message);

          const index = updatedArray.findIndex((msg) => msg.id === message.id);
          console.log("index: ", index);

          if (index !== -1) updatedArray[index].content = message.content;
          console.log("[...updatedArray]: ", [...updatedArray]);
          return [...updatedArray];
        });
      } else if (res.action === "DELETED") {
        setMessages((pre) => {
          const updatedArray = [...pre];

          const index = updatedArray.findIndex((msg) => msg.id === message.id);

          if (index !== -1) updatedArray.splice(index, 1);
          return [...updatedArray];
        });
      }
    });
  }, []);

  console.log("messages final: ", messages);

  return (
    <>
      <img src={reactLogo} className="logo react" alt="React logo" />
      <h1>Web-Sockets</h1>
      <Form setErrMessage={setErrMessage} />
      <h3 style={{ color: "red" }}>{errMessage}</h3>
      <div className="message-box">
        <button onClick={fetchMessages}>Sync</button>
        {messages.map((message, index, arr) => (
          <Message
            key={message.id}
            message={message}
            setMessages={setMessages}
            setErrMessage={setErrMessage}
          />
        ))}
      </div>
    </>
  );
}

export default App;
