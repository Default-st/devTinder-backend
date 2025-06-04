import express from "express";
import { connectDB } from "./config/database.js";
import { User } from "./models/user.js";
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added Successfully");
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
  const data = req.body;
  const id = req.body.userId;
  try {
    const userData = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
    });

    res.send("User Updated Succesfully");
  } catch (err) {
    res.status(500).send("User not updated" + err.message);
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
