import express from "express";
import cors from "cors";
import { io } from "./socket.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
  })
);

app.use(express.json());

const messages = [
  { id: Date.now().toString(), content: "Hello World" },
  { id: Date.now().toString() + 2, content: "Hello React" },
];

app.get("/", (req, res) => res.send("⚙️ Server is Healthy..."));

// Get all messages
app.get("/api/messages", (req, res) => {
  console.log("GET MESSAGES :: ", messages);
  res.send({ data: messages });
});

// Send message
app.post("/api/messages", (req, res) => {
  const { content } = req.body;

  const newMessage = { id: Date.now().toString(), content };

  messages.push(newMessage);

  // send it to all the connected clients
  io.getIO().emit("message", { action: "CREATED", data: newMessage });

  console.log("SEND MESSAGE :: ", messages);

  res.send({ data: "" });
});

// update message
app.patch("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const index = messages.findIndex((message) => message.id === id);

  if (index !== -1) {
    messages[index].content = content;
  }

  // send it to all the connected clients
  io.getIO().emit("message", { action: "UPDATED", data: { id, content } });

  console.log("UPDATE MESSAGE :: ", messages);

  res.send({ data: messages[index] });
});

// delete message
app.delete("/api/messages/:id", (req, res) => {
  const { id } = req.params;
  const index = messages.findIndex((message) => message.id === id);

  let msg;
  if (index !== -1) {
    msg = messages.splice(index, 1);
  }

  // send it to all the connected clients
  io.getIO().emit("message", { action: "DELETED", data: { id } });

  console.log("DELETE MESSAGE :: ", messages);

  res.send({ data: msg });
});

try {
  const server = app.listen(3000, () => {
    console.log("⚙️  Server is Running on Port : 3000");
  });

  const IO = io.init(server);

  IO.on("connection", (socket) => {
    console.log("New client connected");
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
} catch (error) {
  console.log("error: ", error);
}
