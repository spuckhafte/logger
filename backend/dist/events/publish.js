var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Users from "../schema/Users.js";
import Logs from "../schema/Logs.js";
import Hashtags from "../schema/Hashtags.js";
import expireSession from "../helpers/expireSession.js";
export function Publish(myLog, socket) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let { text, hashtag, sessionId } = myLog;
        hashtag = !hashtag ? "unclassified" : hashtag;
        const user = yield Users.findOne({ 'sessionId.id': sessionId });
        if (!user || !user._id) {
            expireSession(socket);
            return;
        }
        const { uid, createdAt, likes } = yield Logs.create({
            text,
            hashtag,
            author: user.uid
        });
        user.myLogs.push(uid);
        const sendLog = {
            id: uid,
            text,
            liked: false,
            totalLikes: likes,
            hashtag,
            src: (_a = user.pfp) !== null && _a !== void 0 ? _a : "",
            displayname: (_b = user.displayName) !== null && _b !== void 0 ? _b : "",
            username: (_c = user.username) !== null && _c !== void 0 ? _c : "",
            when: createdAt,
        };
        socket.broadcast.emit("new-log", sendLog, false);
        socket.emit('new-log', sendLog, true);
        const tag = yield Hashtags.findOne({ name: hashtag });
        if (tag && (tag === null || tag === void 0 ? void 0 : tag._id)) {
            tag.logs.push(uid);
            yield tag.save();
        }
        else {
            yield Hashtags.create({
                name: hashtag,
                logs: [uid]
            });
        }
        yield user.save();
    });
}
