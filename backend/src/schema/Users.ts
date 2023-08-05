import mongoose, { mongo } from "mongoose";
import { v4 } from "uuid";

const userSchema = new mongoose.Schema({
    username: String,
    displayName: String,
    password: String,
    email: String,
    pfp: String,

    uid: {
        type: String,
        default: () => v4()
    },

    createdAt:{
        type: String,
        default: () => Date.now().toString()
    },
    lastActive: {
        type: String,
        default: () => Date.now().toString()
    },
    sessionId: {
        id: String,
        setAt: String
    },
    myLogs: [String], // ids
    likedLogs: [String], // ids
});

export default mongoose.model("Users", userSchema);