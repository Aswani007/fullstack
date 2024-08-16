import Message from "../models/MessagesModel.js";
import { mkdirSync, renameSync } from "fs";

export const getMessagesController = async (req, res) => {
  try {
    const user1 = req.userId; //current user
    const user2 = req.body.id; //other user id

    if (!user1 || !user2) {
      return res.status(400).json({
        message: "Both user id are required",
        error: "Please check if you are providing both user Id or not",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    return res.status(200).json({ messages: "Successful", data: messages });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const uploadFileController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is Required" });
    }

    const dateTime = Date.now();
    let fileDir = `uploads/files/${dateTime}`;
    let fileName = `${fileDir}/${req.file.originalname}`; //filename

    mkdirSync(fileDir, { recursive: true }); //make directory if not available

    renameSync(req.file.path, fileName);

    // const updatedMessage = await Message.findByIdAndUpdate(
    //   req.userId,
    //   {
    //     fileUrl: fileName,
    //   },
    //   {
    //     new: true,
    //     runValidator: true,
    //   }
    // );

    return res.status(200).json({ message: "successful", filePath: fileName });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
