import redis from "../config/redis";
import jwt, { SignOptions } from "jsonwebtoken";
import logger from "../utils/logger";
import bcrypt from "bcrypt";

class TokenService {
  private static readonly ACCESS_TOKEN_EXPIRY = process.env
    .ACCESS_TOKEN_EXPIRY as string;
  private static readonly REFRESH_TOKEN_EXPIRY = process.env
    .REFRESH_TOKEN_EXPIRY as string;

  private static generateTokens(userId: string, role: string) {
    if (!this.ACCESS_TOKEN_EXPIRY || !this.REFRESH_TOKEN_EXPIRY) {
      throw new Error(
        "Token expiry times not configured in environment variables"
      );
    }

    const options: SignOptions = {
      expiresIn: this.ACCESS_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
    };
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET!,
      options
    );

    const refreshOptions: SignOptions = {
      expiresIn: this.REFRESH_TOKEN_EXPIRY as jwt.SignOptions["expiresIn"],
    };
    const refreshToken = jwt.sign(
      { userId },
      process.env.REFRESH_TOKEN_SECRET!,
      refreshOptions
    );

    return { accessToken, refreshToken };
  }

  public static async createTokens(userId: string, role: string) {
    logger.info("Creating tokens for user:", userId);
    const { accessToken, refreshToken } = this.generateTokens(userId, role);

    const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Store refresh token in Redis with expiry
    logger.info("Storing refresh token in Redis for user:", { userId });
    await redis.set(
      `refresh_token:${userId}`,
      hashRefreshToken,
      "EX",
      7 * 24 * 60 * 60
    );

    return { accessToken, refreshToken };
  }

  public static async verifyAccessToken(token: string) {
    try {
      logger.info("Verifying access token");
      return jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
        role: string;
      };
    } catch (error) {
      logger.error("Error verifying access token:", error);
      throw new Error("Invalid access token");
    }
  }

  public static async verifyRefreshToken(token: string) {
    try {
      logger.info("Verifying refresh token");
      const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!) as {
        userId: string;
        role: string;
      };

      // Check if refresh token exists in Redis
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

      if (storedToken) {
        const isMatch = await bcrypt.compare(token, storedToken);
        if (!isMatch) {
          throw new Error("Invalid refresh token");
        }
      } else {
        throw new Error("Invalid refresh token");
      }

      return decoded;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  public static async revokeRefreshToken(userId: string) {
    logger.info("Revoking refresh token for user:", { userId });
    await redis.del(`refresh_token:${userId}`);
  }

  public static async revokeAllUserTokens(userId: string) {
    logger.info("Revoking all tokens for user:", { userId });
    await redis.del(`refresh_token:${userId}`);
  }
}

export default TokenService;
