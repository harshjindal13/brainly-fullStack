
import mongoose, {model, Schema} from "mongoose";
import { MONGODB_URI } from "./config";

console.log("🔌 Attempting to connect to MongoDB:", MONGODB_URI);

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB successfully");
    })
    .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        console.error("💡 Make sure MongoDB is running: mongod --dbpath /data/db");
        process.exit(1);
    });

// Add connection event listeners
mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);