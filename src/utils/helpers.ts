import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { Response } from "express";
import config from "../config";

const SALT_ROUNDS = 10;


/**
 * Hashes a plain text password.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plain text password with a hashed password.
 * @param password - The plain text password.
 * @param hashedPassword - The hashed password to compare with.
 * @returns A promise that resolves to a boolean indicating if they match.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function signToken(userId: string, email: string, res: Response) {
  
  const token = sign({ userId, email }, config.jwtSecret as string, {
    expiresIn: "3d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: config.environment !== "development", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
  });
  return token;
}
