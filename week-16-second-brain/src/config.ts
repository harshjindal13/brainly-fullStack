import dotenv from 'dotenv';
dotenv.config();

export const JWT_PASSWORD = process.env.JWT_SECRET || "fallback-secret-for-dev-only";
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/brainly";
export const PORT = process.env.PORT || 3000;

console.log("✅ Config loaded - JWT_SECRET exists:", !!process.env.JWT_SECRET);