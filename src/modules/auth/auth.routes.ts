import Router from "express";
import { authController } from "../../shared/container";
import { asyncHandler } from "../../utils/async-handler";
import { validate } from "../../middlewares/requestValidationMiddleware";
import {
  generateNewAccessTokenSchema,
  registerUserSchema,
  sendOTPSchema,
  verifyOTPSchema,
} from "./auth.schema";

const router = Router();

router.post(
  "/otp/send",
  validate({ body: sendOTPSchema }),
  asyncHandler(authController.sendOTP.bind(authController)),
);

router.post(
  "/otp/verify",
  validate({ body: verifyOTPSchema }),
  asyncHandler(authController.verifyOTP.bind(authController)),
);

router.post(
  "/register",
  validate({ body: registerUserSchema }),
  asyncHandler(authController.register.bind(authController)),
);

router.get(
  "/refresh",
  validate({ body: generateNewAccessTokenSchema }),
  asyncHandler(authController.generateNewAccessToken.bind(authController)),
);

export default router;
