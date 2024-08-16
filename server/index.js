import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoute.js";
import contactRoute from "./routes/ContactRoute.js";
import setUpSocket from "./socket.js";
import { ORIGIN } from "./utils/helper.js";
import messageRoutes from "./routes/MessagesRoute.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3100;

app.use(
  cors({
    origin: ORIGIN, //"http://localhost:5173", //[process.env.ORIGIN],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credential: true, // to enable cookie, make it to true
    optionsSuccessStatus: 204,
  })
);

//express.static - storing file where i want to store it in my db with public folder
app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoute);
app.use("/api/messages", messageRoutes);

const connectionUri =
  "mongodb+srv://aswani:aswani100aswani@chatdb.lbd6auj.mongodb.net/Node-Chat?retryWrites=true&w=majority&appName=ChatDB";

mongoose
  .connect(connectionUri)
  .then(() => {
    console.log("Connected to DB");
    const server = app.listen(port, () => {
      console.log(`server running at http://localhost:${port}`);
    });
    setUpSocket(server);
  })
  .catch((e) => {
    console.log("Error in Connecting Database", e);
  });
