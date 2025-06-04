import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { validateProfileEditData } from "../utils/validation.js";
import { User } from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt";

export const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req.body)) {
      throw new Error("Invalid Edit Request");
    }
    const user = req.user;
    const data = req.body;

    const newData = await User.findByIdAndUpdate(user._id, data);

    res.json({ message: "Profile Updated" });
  } catch (error) {
    res.status(400).send("Error updating the profile " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { password } = req.body;

    if (!validator.isStrongPassword(password)) {
      throw new Error("Password is weak");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    await user.save();

    res.json({ message: "Password Updated Successfully" });
  } catch (error) {
    res.status(400).send("ERROR :" + error.message);
  }
});
