import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; //token valid till 3 days

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

//user signup
export const signUpController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password is required", error: true });
    }
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res
      .status(200)
      .json({ success: true, token: createToken(email, user.id), data: user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server error");
  }
};

//user login
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password is required", error: true });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with given email not found", error: true });
    }

    const authCheckPassword = await compare(password, user.password);

    if (!authCheckPassword) {
      return res
        .status(404)
        .json({ message: "Incorrect Password", error: true });
    }

    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res
      .status(200)
      .json({ success: true, token: createToken(email, user.id), data: user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server error");
  }
};

//user info
export const getUserInfoController = async (req, res, next) => {
  try {
    console.log(req.userId);
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send({
        message: "User with given Id not found",
        error: true,
      });
    }
    return res.status(200).send({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server error");
  }
};

//update profile
export const updateProfileController = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({
        message: "All the fields as mandatory",
        error: "Please check all the fields before sending to api",
      });
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );

    return res.status(200).send({
      success: "Successful",
      data: userData,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server error");
  }
};

//add profile image
export const addProfileImageController = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please Send File" });
    }

    const dateTime = Date.now();

    let fileName = "uploads/profiles/" + dateTime + req.file.originalname;

    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        img: fileName,
      },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json({ image: updatedUser.img, message: "Uploaded successfully" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server error");
  }
};

//remove profile image
export const removeProfileImageController = async (req, res, next) => {
  try {
    const { userId } = req;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: "Please check the user because it is not in the DB",
      });
    }

    if (user.img) {
      unlinkSync(user.img);
    }

    user.img = null;
    await user.save();

    return res.status(200).json({
      message: "Image deleted Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send("Internal Server error");
  }
};
