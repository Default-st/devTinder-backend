import express from "express";
import { adminAuth } from "./middlewares/auth.js";
const app = express();

// Request Handler
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
  res.send("All Data sent");
});

app.get("/admin/deleteUserData", (req, res) => {
  res.send("user Data deleted");
});

app.listen(3000, () => {
  console.log("Server listening at PORT 3000");
});
