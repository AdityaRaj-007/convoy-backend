import "dotenv/config";

const getEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw Error(`Environment variable ${name} is not defined.`);
  }

  return value;
};

export const env = {
  databaseUrl: getEnv("DATABASE_URL"),
  accessTokenExpiry: getEnv("ACCESS_TOKEN_EXPIRY"),
  refreshTokenExpiry: getEnv("REFRESH_TOKEN_EXPIRY"),
  redisHost: getEnv("REDIS_HOST"),
  redisPort: getEnv("REDIS_PORT"),
};
