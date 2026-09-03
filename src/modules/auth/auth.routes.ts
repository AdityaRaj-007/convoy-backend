import Router from "express";
import { authController } from "./auth.controller";
import { asyncHandler } from "../../utils/async-handler";

const router = Router();

router.post(
  "/otp/send",
  asyncHandler(authController.sendOTP.bind(authController)),
);

router.post(
  "/otp/verify",
  asyncHandler(authController.verifyOTP.bind(authController)),
);

export default router;
