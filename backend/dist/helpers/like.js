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
export function Like(likeLog, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users.findOne({ 'sessionId.id': likeLog.sessionId });
        if (!user || !user._id)
            return;
        const targetLog = yield Logs.findOne({ uid: likeLog.id });
        if (!targetLog)
            return;
        if (likeLog.action == "plus") {
            user.likedLogs.push(likeLog.id);
            targetLog.likes += 1;
        }
        else {
            user.likedLogs = user.likedLogs.filter(logId => logId != likeLog.id);
            targetLog.likes -= 1;
        }
        socket.emit('update-like', likeLog.id, targetLog.likes);
        socket.broadcast.emit('update-like', likeLog.id, targetLog.likes);
        yield user.save();
        yield targetLog.save();
    });
}
