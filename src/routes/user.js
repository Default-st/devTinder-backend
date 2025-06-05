import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
export const userRouter = express.Router();

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "skills",
        "age",
        "about",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "photoUrl",
        "skills",
        "age",
        "about",
      ]);

    const data = connections.map((row) => {
      if (row.fromUserId.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({ message: "User Connections fetched", data: data });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

// Get all the pending(interested) connection request for the loggedin User
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "photoUrl",
      "skills",
      "age",
      "about",
    ]);

    res.json({
      message: "Connection Requests fetched",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    });

    res.json({
      message: "Connection Requests fetched",
      data: connectionRequest,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});
