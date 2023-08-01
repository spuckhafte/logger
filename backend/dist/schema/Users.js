import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    createdAt: {
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
    }
});
export default mongoose.model("Users", userSchema);
