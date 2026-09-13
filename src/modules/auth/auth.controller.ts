import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { env } from "../../config/env";
import { flattenNestedArrayItems } from "ioredis/built/replyTransformers";

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async sendOTP(req: Request, res: Response) {
    const { phoneNumber } = req.body;
    const data = await this.authService.sendOTPToPhoneNumber(phoneNumber);

    return res.status(200).json({ success: true, data, error: null });
  }

  async verifyOTP(req: Request, res: Response) {
    const { otp, phoneNumber } = req.body;

    const data = await this.authService.verifyOTP(phoneNumber, otp);

    // TODO
    // Send refresh token as a cookie

    return res.status(200).json({ success: true, data, error: null });
  }

  async register(req: Request, res: Response) {
    const { verificationToken, name } = req.body;

    const { accessToken, refreshToken } = await this.authService.registerUser(
      name,
      verificationToken,
    );

    console.log("Refresh Token : " + refreshToken);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/api/auth/refresh",
      maxAge: Number(env.refreshTokenExpiry),
    });

    return res
      .status(201)
      .json({ success: true, data: { accessToken }, error: null });
  }

  async generateNewAccessToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, data: null, error: "UNAUTHORIZED" });
    }

    const data = await this.authService.generateNewToken(refreshToken);

    return res.status(200).json({ success: true, data, error: null });
  }
}
