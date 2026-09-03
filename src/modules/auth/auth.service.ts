import { redis } from "../../infrastructure/redis";
import { generateOTP } from "../../utils/generateOTP";
import crypto from "crypto";

export class AuthService {
  async sendOTPToPhoneNumber(phoneNumber: string) {
    const otp = generateOTP();
    console.log(`OTP for phoneNumber ${phoneNumber} is ${otp}`);
    await redis.set(`auht:otp-${phoneNumber}`, otp);
    await redis.expire(`auth:otp-${phoneNumber}`, 600);
    return {};
  }

  async verifyOTPGenerateToken(phoneNumber: string, otp: string) {
    const storedOtp = await redis.get(`auth:otp-${phoneNumber}`);

    if (storedOtp !== otp) {
      return new Error("INCORRECT_OTP");
    }

    await redis.del(`auth:otp-${phoneNumber}`);

    const token = crypto.randomBytes(32).toString("hex");
    return { token };
  }
}

export const authService = new AuthService();
