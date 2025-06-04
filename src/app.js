import express from "express";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
import { validateSignUpData, validateLoginData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    validateLoginData(req.body);

    const { password, emailId } = req.body;
    const userData = await User.findOne({ emailId: emailId });

    if (!userData) {
      throw new Error("Email ID or Password is incorrect");
    }

    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (isPasswordValid) {
      // Create a JWT Token
      const token = await jwt.sign({ _id: userData._id }, "DEV@Tinder$790");

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

app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid token");
    }
    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

    const user = await User.findById(decodedMessage._id);

    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.get("/getUserById", async (req, res) => {
  const user = req.body;

  try {
    const userData = await User.findById(user.userID);
    if (userData) {
      res.send(userData);
    } else {
      res.status(500).send("User not found");
    }
  } catch (error) {}
});

app.delete("/user", async (req, res) => {
  const user = req.body.userID;

  try {
    const userData = await User.findByIdAndDelete(user);
    console.log(userData);
    res.send("User Deleted Succesfully");
  } catch (err) {
    res.status(500).send("User not found");
  }
});

app.patch("/user", async (req, res) => {
  const { userId: id, ...data } = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const userData = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
    });

    res.send("User Updated Succesfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.patch("/userUpdateEmail", async (req, res) => {
  const userEmail = req.body.emailId;
  const userData = req.body;
  try {
    const data = await User.findOneAndUpdate({ emailId: userEmail }, userData);
    res.send("User updated successfully");
  } catch (error) {
    res.status(500).send("User not updated");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server listening at PORT 3000");
    });
  })
  .catch((err) => {
    console.log("Databse connection failed");
  });
