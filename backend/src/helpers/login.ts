import { Socket } from "socket.io";
import { LoginData } from "../../../types";
import Users from "../schema/Users.js";
import { sessionExpired, sha } from "./funcs.js";

export default async function LoginUser(userData: LoginData, socket: Socket) {
    const { username, password, sessionId } = userData;

    if (!sessionId) {
        const user = await Users.findOne({ username, password: sha(password as string) });

        // failed
        if (!user?._id) {
            socket.emit('login-failed', 'invalid credentials');
            return false;
        }

        // if sessionId has expired, set new.
        let newSessionId = sha(Date.now().toString());
        if (sessionExpired(user.sessionId?.setAt as string)) {
            user.sessionId = {
                id: newSessionId,
                setAt: Date.now().toString(),
            }
        } else newSessionId = user.sessionId?.id as string;
        user.lastActive = Date.now().toString();
        await user.save();

        socket.emit('entry-ok', newSessionId);
    } else {
        const user = await Users.findOne({ 'sessionId.id': sessionId });
        
        if (!user?._id || sessionExpired(user.sessionId?.setAt as string)) {
            socket.emit('auto-login-failed');
        } else {
            user.lastActive = Date.now().toString();
            await user.save();
            socket.emit('entry-ok', user?.sessionId?.id)
        }
    }
}
