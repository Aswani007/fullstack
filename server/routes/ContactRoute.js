import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleware.js";
import {
  getContactsForDMListController,
  searchContactsController,
} from "../controllers/ContactController.js";

const contactRoute = Router();

//search contacts
contactRoute.post("/search", verifyToken, searchContactsController);

contactRoute.get(
  "/get-contacts-for-dm",
  verifyToken,
  getContactsForDMListController
);

export default contactRoute;
