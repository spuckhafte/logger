import { Socket } from "socket.io";
import { LikeLog } from "../../../types";
import Users from "../schema/Users.js";
import Logs from "../schema/Logs.js";
import expireSession from "../helpers/expireSession.js";
import { io } from "../server.js";

export async function Like(likeLog: LikeLog, socket: Socket) {
    const user = await Users.findOne({ 'sessionId.id': likeLog.sessionId });
    if (!user || !user._id) {
        expireSession(socket);
        return;
    }
    
    const targetLog = await Logs.findOne({ uid: likeLog.id });
    if (!targetLog) return;

    if (likeLog.action == "plus") {
        user.likedLogs.push(likeLog.id);
        targetLog.likes += 1;
    } else {
        user.likedLogs = user.likedLogs.filter(logId => logId != likeLog.id);
        targetLog.likes -= 1;
    }

    io.emit('update-like', likeLog.id, targetLog.likes, socket.id, likeLog.action);

    await user.save();
    await targetLog.save();
}