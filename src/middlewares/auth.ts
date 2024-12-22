import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config";
import User from "../models/user";

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).json({ error: "Missing Header" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ error: "No Token or Invalid token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);

    // Check if decoded is JwtPayload
    if (typeof decoded === "object" && "email" in decoded) {
      const user = await User.findOne({ email: decoded.email }).select(
        "-password"
      );
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      req.user = user;

      next();
    }
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" });
  }
}
