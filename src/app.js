import express from "express";
import { adminAuth } from "./middlewares/auth.js";
const app = express();

app.get("/getUserData", (req, res) => {
  // logic of DB call and get user data
  throw new Error("Random Error");
  res.send("All Data sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    // Log your error
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Server listening at PORT 3000");
});
