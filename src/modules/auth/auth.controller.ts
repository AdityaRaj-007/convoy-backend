import { Request, Response } from "express";
import { AuthService, authService } from "./auth.service";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async sendOTP(req: Request, res: Response) {
    const { phoneNumber } = req.body;
    const data = this.authService.sendOTPToPhoneNumber(phoneNumber);

    return res.status(200).json({ success: true, data, error: null });
  }

  async verifyOTP(req: Request, res: Response) {
    const { otp, phoneNumber } = req.body;

    const data = this.authService.verifyOTPGenerateToken(phoneNumber, otp);

    return res.status(201).json({ success: true, data, error: null });
  }
}

export const authController = new AuthController(authService);
