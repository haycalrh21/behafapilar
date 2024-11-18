import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.get("Authorization");

  if (!token) {
    throw new Error("Unauthorized");
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "");

  try {
    const decoded = jwt.verify(token, "secret");

    if (typeof decoded !== "object" || !decoded) {
      res.sendStatus(401).json({ error: "Unauthorized" });
      return;
    }
    req.body.user = decoded;
    // console.log(decoded);
    next();
  } catch (error) {
    throw new Error("Unauthorized");
  }
}
