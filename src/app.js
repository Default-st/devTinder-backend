import express from "express";

const app = express();

// Request Handler
app.use("/", (req, res) => {
  res.send("Hello from the dashboard");
});

// Request Handler
app.use("/test", (req, res) => {
  res.send("Test Server");
});

// Request Handler
app.use("/hello", (req, res) => {
  res.send("Hello From Server");
});

app.listen(3000, () => {
  console.log("Server listening at PORT 3000");
});
