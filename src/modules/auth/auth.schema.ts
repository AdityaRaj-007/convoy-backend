import z from "zod";

export const sendOTPSchema = z.object({
  phoneNumber: z.string(),
});

export const verifyOTPSchema = z.object({
  phoneNumber: z.string(),
  otp: z.string(),
});

export const registerUserSchema = z.object({
  name: z.string(),
  verificationToken: z.string(),
});

export const generateNewAccessTokenSchema = z.object({
  refreshToken: z.string(),
});
