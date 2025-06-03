import express from "express";

const app = express();

// Request Handler
app.get("/user", (req, res) => {
  res.send({ firstName: "Satyansh", lastName: "Srivastava" });
});

app.post("/user", (req, res) => {
  res.send("Saved data to the database");
});

app.delete("/user", (req, res) => {
  res.send("Deleted user data from the database");
});

app.listen(3000, () => {
  console.log("Server listening at PORT 3000");
});
