import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";

export const searchContactsController = async (req, res, next) => {
  try {
    const { searchQuery } = req.body;
    console.log(searchQuery);
    if (searchQuery === undefined || searchQuery === null) {
      return res.status(400).json({ message: "Search Term is Required" });
    }

    const sanitizedSearch = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSearch, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    console.log(contacts.length);

    return res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const getContactsForDMListController = async (req, res) => {
  let userId = req.userId;
  try {
    userId = new mongoose.Types.ObjectId(userId);

    //running queries
    //1st -> matching the sender or recipient user id - $match:
    //2nd -> $sort - sorting based on timestamp
    //3rd -> $group - grouping with condition i.e if id is senderUserId then need recipient or else sender id

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      { $unwind: "$contactInfo" },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          img: "$contactInfo.img",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({ message: "Successful", data: contacts });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
