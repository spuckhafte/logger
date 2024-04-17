import mongoose from "mongoose";
import { v4 } from 'uuid';

const logSchema = new mongoose.Schema({
    uid: {
        type: String,
        default: () => v4()
    },
    text: String,
    hashtag: String,
    createdAt: {
        type: String,
        default: () => Date.now().toString()
    },
    author: String, // uid,
    likes: {
        type: Number,
        default: 0
    }
});

export default mongoose.model('Logs', logSchema);