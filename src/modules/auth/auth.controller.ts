import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
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

    const data = this.authService.verifyOTP(phoneNumber, otp);

    return res.status(200).json({ success: true, data, error: null });
  }

  async register(req: Request, res: Response) {
    const { verificationToken, name } = req.body;

    const data = await this.authService.registerUser(name, verificationToken);

    return res.status(201).json({ success: true, data, error: null });
  }

  async generateNewAccessToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    const data = await this.authService.generateNewToken(refreshToken);

    return res.status(200).json({ success: true, data, error: null });
  }
}
