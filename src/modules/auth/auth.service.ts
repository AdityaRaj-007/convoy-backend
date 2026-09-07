import { redis } from "../../infrastructure/redis";
import { generateOTP } from "../../utils/generateOTP";
import crypto from "crypto";
import { IAuthRepository } from "./auth.repository";
import { env } from "../../config/env";

export class AuthService {
  private readonly authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async createSession(userId: string) {
    const accessToken = crypto.randomBytes(32).toString("hex");
    const refreshToken = crypto.randomBytes(32).toString("hex");

    const accessTokenHash = crypto
      .createHash("sha256")
      .update(accessToken)
      .digest("hex");
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    await redis.set(
      `auth:access:${accessTokenHash}`,
      userId,
      "EX",
      env.accessTokenExpiry,
    );

    await redis.set(
      `auth:refresh:${refreshTokenHash}`,
      userId,
      "EX",
      env.refreshTokenExpiry,
    );
    return { accessToken, refreshToken };
  }

  async generateNewAccessToken(userId: string) {
    const accessToken = crypto.randomBytes(32).toString("hex");

    const accessTokenHash = crypto
      .createHash("sha256")
      .update(accessToken)
      .digest("hex");

    await redis.set(
      `auth:access:${accessTokenHash}`,
      userId,
      "EX",
      env.accessTokenExpiry,
    );

    return accessToken;
  }

  async sendOTPToPhoneNumber(phoneNumber: string) {
    const otp = generateOTP();
    console.log(`OTP for phoneNumber ${phoneNumber} is ${otp}`);
    await redis.set(`auth:otp:${phoneNumber}`, otp, "EX", 600);
    return { message: "OTP sent successfully" };
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    const storedOtp = await redis.get(`auth:otp:${phoneNumber}`);

    if (storedOtp !== otp) {
      return new Error("INCORRECT_OTP");
    }

    await redis.del(`auth:otp:${phoneNumber}`);

    const existingUser = await this.authRepository.findUser(phoneNumber);
    if (!existingUser) {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      await redis.set(
        `auth:verification:${verificationToken}`,
        phoneNumber,
        "EX",
        600,
      );

      return { isNewUser: true, verificationToken };
    }

    const userId = existingUser.id;
    const { accessToken, refreshToken } = await this.createSession(userId);

    return { accessToken, refreshToken };
  }

  async registerUser(name: string, verificationToken: string) {
    const phoneNumber = await redis.get(
      `auth:verification:${verificationToken}`,
    );

    if (!phoneNumber) {
      throw new Error("VERIFICATION_TOKEN_EXPIRED");
    }

    const userData = await this.authRepository.createUser(phoneNumber, name);

    await redis.del(`auth:verification:${verificationToken}`);

    const userId = userData.id;

    const { accessToken, refreshToken } = await this.createSession(userId);

    return { accessToken, refreshToken };
  }

  async generateNewToken(refreshToken: string) {
    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");

    const userId = await redis.get(`auth:refresh:${refreshTokenHash}`);

    if (!userId) {
      throw new Error("UNAUTHORIZED");
    }

    const existingUser = await this.authRepository.findUserById(userId);

    if (!existingUser || userId !== existingUser.id) {
      throw new Error("UNAUTHORIZED");
    }

    // later add refreshToken rotation
    const accessToken = await this.generateNewAccessToken(existingUser.id);

    return { accessToken, refreshToken };
  }
}
