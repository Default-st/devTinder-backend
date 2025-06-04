import express from "express";
import bcrypt from "bcrypt";
import { validateLoginData, validateSignUpData } from "../utils/validation.js";
import { User } from "../models/user.js";

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  try {
    validateSignUpData(req.body);

    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const { firstName, lastName, emailId } = req.body;

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error signing up the user: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    validateLoginData(req.body);

    const { password, emailId } = req.body;
    const userData = await User.findOne({ emailId: emailId });

    if (!userData) {
      throw new Error("Email ID or Password is incorrect");
    }

    const isPasswordValid = await userData.isPasswordValid(password);
    if (isPasswordValid) {
      // Create a JWT Token
      const token = await userData.getJWT();
      // Add the token to cookie and send the response back to the server
      res.cookie("token", token);

      res.send("Login Successful");
    } else {
      throw new Error("Email ID or Password is incorrect");
    }
  } catch (error) {
    res.status(400).send("Error signing up the user: " + error.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.send("Logged out");
});
