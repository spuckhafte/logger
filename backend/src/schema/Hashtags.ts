import mongoose from "mongoose";
import { v4 } from "uuid";

const hashtagSchema = new mongoose.Schema({
    name: String,

    uid: {
        type: String,
        default: () => v4()
    },
    logs: [String], // ids
    createdAt: {
        type: String,
        default: () => Date.now().toString()
    }
});

export default mongoose.model('Hashtags', hashtagSchema);