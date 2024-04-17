import { Socket } from "socket.io";
import Logs from "../schema/Logs.js";
import Users from "../schema/Users.js";
import { ALog } from "../../../types.js";
import expireSession from "../helpers/expireSession.js";
import Hashtags from "../schema/Hashtags.js";

export default async function SendLogs(sessionId: string, lastLogId: string | null, filterTag: string|null, socket: Socket) {
    const user = await Users.findOne({ 'sessionId.id': sessionId });
    if (!user || !user._id) {
        expireSession(socket);
        return;
    }
    
    const hashtag = await Hashtags.findOne({ name: filterTag });

    const allLogs = (filterTag && hashtag && hashtag._id) ? 
        await Logs.find({ hashtag: filterTag }).sort({ 'createdAt': -1 })
        : await Logs.find({}).sort({ 'createdAt': -1 });
    
    let from = 0;

    if (lastLogId) {
        from = allLogs.findIndex(aLog => aLog.uid == lastLogId) + 1;
    }

    const isLastLog = (from + 10) >= (allLogs.length - 1);

    const reqLogs = await Promise.all(allLogs.splice(from, 20).map(async log => {
        const author = await Users.findOne({ uid: log.author });
        return {
            id: log.uid,

            text: log.text as string,
            totalLikes: log.likes as number,
            hashtag: log.hashtag,
            liked: user.likedLogs.includes(log.uid),

            src: author?.pfp ?? "",
            displayname: author?.displayName ?? "",
            username: author?.username ?? "",

            when: log.createdAt as string,
        }
    })) as ALog[];

    socket.emit('parsed-logs', reqLogs, isLastLog);
}