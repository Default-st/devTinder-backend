import express from "express";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
const app = express();

app.post("/signup", async (req, res, next) => {
  const userObj = {
    firstName: "Anku",
    lastName: "Srivastava",
    emailId: "anku@gmail.com",
    password: "ankur@123",
    age: 23,
    gender: "Male",
  };

  // Creating a new instance of the User model
  const user = new User(userObj);
  try {
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
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
