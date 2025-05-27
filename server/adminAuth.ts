import type { RequestHandler } from "express";
import { storage } from "./storage";

export const isAdmin: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user as any;

    if (!req.isAuthenticated() || !user.expires_at) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const now = Math.floor(Date.now() / 1000);
    if (now > user.expires_at) {
      return res.status(401).json({ message: "Session expired" });
    }

    const userId = user.claims.sub;
    const userRecord = await storage.getUser(userId);
    
    if (!userRecord || userRecord.isAdmin !== 1) {
      return res.status(403).json({ message: "Admin access required" });
    }

    return next();
  } catch (error) {
    console.error("Error checking admin status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};