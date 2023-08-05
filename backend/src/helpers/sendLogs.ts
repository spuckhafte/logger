import { Socket } from "socket.io";
import Logs from "../schema/Logs.js";
import Users from "../schema/Users.js";
import { ALog } from "../../../types";

export default async function SendLogs(sessionId: string, lastLogId: string|null, socket: Socket) {
    const allLogs = await Logs.find({});
    const user = await Users.findOne({ 'sessionId.id': sessionId });

    let from = 0;

    if (!lastLogId) {
        from = allLogs.findIndex(aLog => aLog.id == lastLogId) + 1;
    }

    const reqLogs = await Promise.all(allLogs.splice(from, 10).map(async log => {
        const author = await Users.findOne({ uid: log.author });
        return {
            id: log.uid,

            text: log.text as string,
            totalLikes: log.likes as number,
            hashtag: log.hashtag,
            liked: user?.likedLogs.includes(log.uid) as boolean,

            src: author?.pfp ?? "",
            displayname: author?.displayName ?? "",
            username: author?.username ?? "",

            when: log.createdAt as string,
        }
    })) as ALog[];

    socket.emit('parsed-logs', reqLogs);
}