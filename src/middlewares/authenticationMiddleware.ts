import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/verifyToken";

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

    const userId = await verifyToken(authHeader);

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
