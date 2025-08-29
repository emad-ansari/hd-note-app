import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

declare global {
	namespace Express {
		interface Request {
			userId?: string;
		}
	}
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || "defaultSecret"; // <-- now inside

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

