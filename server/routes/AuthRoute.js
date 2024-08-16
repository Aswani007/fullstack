import { Router } from "express";
import {
  addProfileImageController,
  getUserInfoController,
  loginController,
  signUpController,
  updateProfileController,
  removeProfileImageController,
} from "../controllers/AuthController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import multer from "multer";

const authRoutes = Router();
//multer- for uploading image using formData
const upload = multer({ dest: "uploads/profiles/" });

//signup
authRoutes.post("/signup", signUpController);
//login
authRoutes.post("/login", loginController);
//get user info
authRoutes.get("/user-info", verifyToken, getUserInfoController);
//update - profile

authRoutes.post("/update-profile", verifyToken, updateProfileController);

//add profile image
authRoutes.post(
  "/add-profile-image",
  verifyToken,
  upload.single("profile-image"),
  addProfileImageController
);

authRoutes.delete(
  "/remove-profile-image",
  verifyToken,
  removeProfileImageController
);

export default authRoutes;
