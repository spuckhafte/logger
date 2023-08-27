var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Logs from "../schema/Logs.js";
import Users from "../schema/Users.js";
import expireSession from "../helpers/expireSession.js";
import Hashtags from "../schema/Hashtags.js";
import { cache } from "../server.js";
export default function SendLogs(sessionId, lastLogId, filterTag, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users.findOne({ 'sessionId.id': sessionId });
        if (!user || !user._id) {
            expireSession(socket);
            return;
        }
        if (!filterTag) {
            const cacheData = (yield cache.json.get(socket.id, { path: '.' }));
            const cachedLogs = cacheData.logs;
            console.log(cachedLogs);
            const lastLogIndexInCache = cachedLogs.findIndex(log => log.id == lastLogId);
            if (lastLogIndexInCache >= 0 &&
                lastLogIndexInCache != (cachedLogs.length - 1)) {
                socket.emit('parsed-logs', cachedLogs, false);
                return;
            }
        }
        const hashtag = yield Hashtags.findOne({ name: filterTag });
        const allLogs = (filterTag && hashtag && hashtag._id) ?
            yield Logs.find({ hashtag: filterTag }).sort({ 'createdAt': -1 })
            : yield Logs.find({}).sort({ 'createdAt': -1 });
        let from = 0;
        if (lastLogId) {
            from = allLogs.findIndex(aLog => aLog.uid == lastLogId) + 1;
        }
        const isLastLog = (from + 10) >= (allLogs.length - 1);
        const reqLogs = yield Promise.all(allLogs.splice(from, 20).map((log) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const author = yield Users.findOne({ uid: log.author });
            return {
                id: log.uid,
                text: log.text,
                totalLikes: log.likes,
                hashtag: log.hashtag,
                liked: user.likedLogs.includes(log.uid),
                src: (_a = author === null || author === void 0 ? void 0 : author.pfp) !== null && _a !== void 0 ? _a : "",
                displayname: (_b = author === null || author === void 0 ? void 0 : author.displayName) !== null && _b !== void 0 ? _b : "",
                username: (_c = author === null || author === void 0 ? void 0 : author.username) !== null && _c !== void 0 ? _c : "",
                when: log.createdAt,
            };
        })));
        if (!filterTag) {
            const prev = (yield cache.json.get(socket.id, { path: '.' }));
            cache.json.set(socket.id, '.', { logs: [...prev.logs, reqLogs] });
        }
        socket.emit('parsed-logs', reqLogs, isLastLog);
    });
}
