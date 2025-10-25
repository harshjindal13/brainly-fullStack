import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "./config";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("🔐 Auth middleware called for:", req.method, req.path);
    
    const header = req.headers["authorization"];
    console.log("Authorization header:", header ? "Present" : "Missing");
    
    if (!header) {
        console.log("❌ No authorization header");
        res.status(403).json({ message: "Authorization header missing" });
        return;
    }
    
    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    console.log("Token extracted, length:", token.length);
    
    if (!JWT_PASSWORD) {
        console.error("❌ JWT_PASSWORD is not defined in environment variables!");
        res.status(500).json({ message: "Server configuration error" });
        return;
    }
    
    try {
        const decoded = jwt.verify(token, JWT_PASSWORD);
        console.log("✅ JWT verified successfully");
        
        if (typeof decoded === "string") {
            console.log("❌ JWT decoded as string");
            res.status(403).json({
                message: "You are not logged in"
            });
            return;
        }
        
        req.userId = (decoded as JwtPayload).id;
        console.log("User ID extracted:", req.userId);
        next();
        
    } catch (error: any) {
        console.error("❌ JWT verification failed:", error.message);
        res.status(403).json({ message: "Invalid token" });
        return;
    }
}
