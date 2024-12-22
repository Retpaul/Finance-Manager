import { Request } from "express";
import User from "./models/user"

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust the type of `user` to match your needs, e.g., `User` interface or `Record<string, any>`
    }
  }
}

