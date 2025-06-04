import express from "express";
import { userAuth } from "../middlewares/auth.js";

export const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});
