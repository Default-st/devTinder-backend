import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";
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
    // Find all users that dont have connection request(status) with the current user
    // and not see his own card
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    }).select(["fromUserId", "toUserId"]);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
      ],
    })
      .select(["firstName", "lastName", "about", "skills", "age", "photoUrl"])
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Connection Requests fetched",
      data: users,
    });
  } catch (error) {
    res.status(400).json({ message: "ERROR: " + error.message });
  }
});
