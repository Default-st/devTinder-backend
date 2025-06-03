import express from "express";

const app = express();

// Request Handler
app.get("/user/:userID", (req, res) => {
  console.log(req.params);
  res.send({ firstName: "Satyansh", lastName: "Srivastava" });
});

app.listen(3000, () => {
  console.log("Server listening at PORT 3000");
});
