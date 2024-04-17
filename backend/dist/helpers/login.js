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
import { sessionExpired, sha } from "./funcs.js";
export default function LoginUser(userData, socket) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const { username, password, sessionId } = userData;
        if (!sessionId) {
            const user = yield Users.findOne({ username, password: sha(password) });
            if (!(user === null || user === void 0 ? void 0 : user._id)) {
                socket.emit('login-failed', 'invalid credentials');
                return false;
            }
            let newSessionId = sha(Date.now().toString());
            if (sessionExpired((_a = user.sessionId) === null || _a === void 0 ? void 0 : _a.setAt)) {
                user.sessionId = {
                    id: newSessionId,
                    setAt: Date.now().toString(),
                };
            }
            else
                newSessionId = (_b = user.sessionId) === null || _b === void 0 ? void 0 : _b.id;
            user.lastActive = Date.now().toString();
            yield user.save();
            socket.emit('entry-ok', {
                username,
                email: user.email,
                sessionId: newSessionId,
                displayName: user.displayName,
                pfp: user.pfp
            });
        }
        else {
            const user = yield Users.findOne({ 'sessionId.id': sessionId });
            if (!(user === null || user === void 0 ? void 0 : user._id) || sessionExpired((_c = user.sessionId) === null || _c === void 0 ? void 0 : _c.setAt)) {
                socket.emit('auto-login-failed');
            }
            else {
                user.lastActive = Date.now().toString();
                yield user.save();
                socket.emit('entry-ok', {
                    username: user.username,
                    email: user.email,
                    sessionId: (_d = user.sessionId) === null || _d === void 0 ? void 0 : _d.id,
                    displayName: user.displayName,
                    pfp: user.pfp
                });
            }
        }
    });
}
