import { Server as SocketIOServer } from "socket.io";
import { ORIGIN } from "./utils/helper.js";
import Message from "./models/MessagesModel.js";

const setUpSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: ORIGIN,
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
      optionsSuccessStatus: 204,
    },
  });

  const userSocketMap = new Map();

  //disconnect socket
  const disconnect = (socket) => {
    console.log(`client disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    //get socket Id
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);
    console.log(message);
    console.log(`sender socket id - ${senderSocketId}`);
    console.log(`recipientSocketId socket id - ${recipientSocketId}`);

    const createdMessage = await Message.create(message);

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    //send message to both user
    //if the user is online then emit the event
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receivedMessage", messageData);
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("receivedMessage", messageData);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    //if there is user id
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log("user connected " + userId + " with socket id " + socket.id);
    } else {
      console.log("user Id not provided during connection");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setUpSocket;
