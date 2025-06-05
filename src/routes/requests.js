import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { ConnectionRequest } from "../models/connectionRequest.js";
import { User } from "../models/user.js";

export const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"].includes(status);

      if (!allowedStatus) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type " + status });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not Found" });
      }

      const connectionRequestAlreadyExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (connectionRequestAlreadyExist) {
        throw new Error("Connection Request already exists");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message: req.user.firstName + " " + status + " " + toUser.firstName,
        data: data,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);
