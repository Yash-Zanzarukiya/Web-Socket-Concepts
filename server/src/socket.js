import { Server } from "socket.io";
let IO;
export const io = {
  init: (server) => {
    IO = new Server(server, {
      cors: {
        origin: ["http://localhost:5173"],
      },
    });
    return IO;
  },
  getIO: () => {
    if (!IO) throw new Error("Socket is not initialized!!!");
    return IO;
  },
};
