import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import {
  getMessagesController,
  uploadFileController,
} from "../controllers/MessagesController.js";
import multer from "multer";

const messageRoutes = Router();

//multer- for uploading image using formData
const upload = multer({ dest: "uploads/files/" });

// -> /api/messages
//get all messages
messageRoutes.post("/get-messages", verifyToken, getMessagesController);

//file upload
messageRoutes.post("/upload-file", upload.single("file"), uploadFileController);

export default messageRoutes;
