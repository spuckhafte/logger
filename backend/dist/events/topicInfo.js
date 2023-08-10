var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Hashtags from "../schema/Hashtags.js";
import Users from "../schema/Users.js";
import Logs from "../schema/Logs.js";
export default function TopicInfo(topic, sessionId, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield Users.findOne({ 'sessionId.id': sessionId });
        const hashtag = yield Hashtags.findOne({ name: topic });
        if (!user || !hashtag || !user._id || !hashtag._id) {
            socket.emit('hashtag-details', {
                firstLog: null, lastActive: null, totalLogs: null, myLogs: null
            });
            return;
        }
        const tagSpecificLogs = yield Logs.find({ hashtag: hashtag.name });
        const myLogs = tagSpecificLogs.filter(log => log.author == user.uid).length;
        const tagInfo = {
            firstLog: tagSpecificLogs[0].createdAt,
            lastActive: tagSpecificLogs[tagSpecificLogs.length - 1].createdAt,
            totalLogs: tagSpecificLogs.length.toString(),
            myLogs: myLogs.toString()
        };
        socket.emit('hashtag-details', tagInfo);
    });
}
