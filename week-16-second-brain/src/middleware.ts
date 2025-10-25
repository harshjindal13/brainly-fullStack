import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    
    if (!header) {
        return res.status(403).json({ message: "Authorization header missing" });
    }
    
    // Handle both formats: "Bearer token" and just "token"
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    
    try {
        const decoded = jwt.verify(token, JWT_PASSWORD);
        if (typeof decoded === "string") {
            res.status(403).json({
                message: "You are not logged in"
            })
            return;    
        }
        req.userId = (decoded as JwtPayload).id;
        next()
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}
