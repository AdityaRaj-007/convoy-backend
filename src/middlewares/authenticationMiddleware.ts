import { NextFunction, Request, Response } from "express";
import { redis } from "../infrastructure/redis";
import crypto from "crypto";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const [scheme, authToken] = authHeader.split(" ");

    if (!authToken || scheme !== "Bearer") {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const authTokenHash = crypto
      .createHash("sha256")
      .update(authToken)
      .digest("hex");
    const userId = await redis.get(`auth:access:${authTokenHash}`);

    if (!userId) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    console.log("UserId : " + userId);

    req.user = { userId };
    return next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, data: null, error: "SERVER_ERROR" });
  }
};
