import { Socket } from "socket.io";
import { ALog, PublishLog } from "../../../types";
import Users from "../schema/Users.js";
import Logs from "../schema/Logs.js";
import Hashtags from "../schema/Hashtags.js";
import expireSession from "../helpers/expireSession.js";

export async function Publish(myLog: PublishLog, socket: Socket) {
    let { text, hashtag, sessionId } = myLog;

    hashtag = !hashtag ? "unclassified" : hashtag;

    const user = await Users.findOne({ 'sessionId.id': sessionId });
    if (!user || !user._id) {
        expireSession(socket);
        return;
    }

    const { uid, createdAt, likes } = await Logs.create({
        text,
        hashtag,
        author: user.uid
    });

    user.myLogs.push(uid);

    const sendLog: ALog = {
        id: uid, 
        text,
        liked: false,
        totalLikes: likes,
        hashtag,

        src: user.pfp ?? "",
        displayname : user.displayName ?? "",
        username: user.username ?? "",

        when: createdAt,
    }

    socket.broadcast.emit("new-log", sendLog, false);
    socket.emit('new-log', sendLog, true);

    const tag = await Hashtags.findOne({ name: hashtag });
    if (tag && tag?._id) {
        tag.logs.push(uid);
        await tag.save();
    } else {
        await Hashtags.create({
            name: hashtag,
            logs: [uid]
        });
    }
    await user.save();
}