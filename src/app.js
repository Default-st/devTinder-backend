import express from "express";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
import { validateSignUpData, validateLoginData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import { userAuth } from "./middlewares/auth.js";

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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  console.log(user);
  res.send("Connection Request sent by " + user.firstName);
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
