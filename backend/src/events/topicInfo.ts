import { Socket } from "socket.io";
import Hashtags from "../schema/Hashtags.js";
import Users from "../schema/Users.js";
import { HashtagInfo } from "../../../types.js";
import Logs from "../schema/Logs.js";

export default async function TopicInfo(topic: string, sessionId: string, socket: Socket) {
    const user = await Users.findOne({ 'sessionId.id': sessionId });
    const hashtag = await Hashtags.findOne({ name: topic });
    
    if (!user || !hashtag || !user._id || !hashtag._id) {
        socket.emit('hashtag-details', {
            firstLog: null, lastActive: null, totalLogs: null, myLogs: null
        } as HashtagInfo);
        return;
    }


    const tagSpecificLogs = await Logs.find({ hashtag: hashtag.name });
    const myLogs = tagSpecificLogs.filter(log => log.author == user.uid).length;

    const tagInfo: HashtagInfo = {
        firstLog: tagSpecificLogs[0].createdAt,
        lastActive: tagSpecificLogs[tagSpecificLogs.length - 1].createdAt,
        totalLogs: tagSpecificLogs.length.toString(),
        myLogs: myLogs.toString()
    }

    socket.emit('hashtag-details', tagInfo);
}