import Router from "express";
import { authController } from "../../shared/container";
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

router.post(
  "/register",
  asyncHandler(authController.register.bind(authController)),
);

router.get(
  "/refresh",
  asyncHandler(authController.generateNewAccessToken.bind(authController)),
);

export default router;
