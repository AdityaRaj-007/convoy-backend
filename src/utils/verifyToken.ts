import { redis } from "../infrastructure/redis";
import crypto from "crypto";

export async function verifyToken(authHeader: string): Promise<string | null> {
  const [scheme, authToken] = authHeader.split(" ");

  if (!authToken || scheme !== "Bearer") {
    throw new Error("UNAUTHORIZED");
  }

  const authTokenHash = crypto
    .createHash("sha256")
    .update(authToken)
    .digest("hex");

  return await redis.get(`auth:access:${authTokenHash}`);
}
