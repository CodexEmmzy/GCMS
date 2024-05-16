import * as jwt from "jsonwebtoken";
import { TOKEN_PASSWORD } from "../tokens/password.token";

export interface AuthTokenPayload {
  adminId: number;
}

export const auth = (header: string): AuthTokenPayload => {
  try {
    
    if (!header) {
      throw new Error("Authorization header is missing");
    }

    const tokenParts = header.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      throw new Error("Invalid authorization header format");
    }
    const token = tokenParts[1];

    if (!token) {
      throw new Error("Token is missing");
    }

    return jwt.verify(token, TOKEN_PASSWORD as jwt.Secret) as AuthTokenPayload;
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw new Error("Invalid token");
  }
};
