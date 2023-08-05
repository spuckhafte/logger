var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendMail } from "./mail.js";
import Users from "../schema/Users.js";
import { getPfp, sha } from "./funcs.js";
export default function AuthorizeUser(userData, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        let alreadyExistingUser = yield Users.findOne({ email: userData.email });
        if (alreadyExistingUser === null || alreadyExistingUser === void 0 ? void 0 : alreadyExistingUser._id) {
            socket.emit('verification-error', 'email already taken');
            return false;
        }
        alreadyExistingUser = yield Users.findOne({ username: userData.username });
        if (alreadyExistingUser === null || alreadyExistingUser === void 0 ? void 0 : alreadyExistingUser._id) {
            socket.emit('verification-error', 'username already taken');
            return false;
        }
        try {
            const otp = generateOTP();
            yield sendMail(userData.email, otp.toString());
            socket.emit('verify-otp', otp);
        }
        catch (e) {
            socket.emit('verification-error', 'invalid mail');
            return false;
        }
        userData.password = sha(userData.password);
        socket.on('verified', () => __awaiter(this, void 0, void 0, function* () {
            alreadyExistingUser = yield Users.findOne({ email: userData.email });
            if (alreadyExistingUser === null || alreadyExistingUser === void 0 ? void 0 : alreadyExistingUser._id) {
                if (alreadyExistingUser.password == userData.password)
                    return false;
                else {
                    console.log('here');
                    socket.emit('verification-error', 'email already taken');
                    return false;
                }
            }
            alreadyExistingUser = yield Users.findOne({ username: userData.username });
            if ((alreadyExistingUser === null || alreadyExistingUser === void 0 ? void 0 : alreadyExistingUser._id) && alreadyExistingUser.password != userData.password) {
                socket.emit('verification-error', 'username already taken');
                return false;
            }
            const sessionId = sha(Date.now().toString());
            yield Users.create(Object.assign(Object.assign({}, userData), { displayName: userData.username, sessionId: {
                    id: sessionId,
                    setAt: Date.now().toString(),
                }, pfp: getPfp(userData.username) }));
            socket.emit('entry-ok', {
                username: userData.username,
                displayName: userData.username,
                email: userData.email,
                sessionId,
                pfp: getPfp(userData.username)
            });
        }));
        return true;
    });
}
function generateOTP() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let otp = '';
    for (let i = 0; i < 5; i++)
        otp += numbers[Math.floor(Math.random() * numbers.length)].toString();
    return otp;
}
