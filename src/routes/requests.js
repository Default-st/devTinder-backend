import express from "express";
import { userAuth } from "../middlewares/auth.js";

export const requestRouter = express.Router();

requestRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send("Connection Request sent by " + user.firstName);
});
