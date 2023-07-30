var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sendMail } from "./mail";
import Users from "../schema/Users";
import { createHash } from 'node:crypto';
export default function AuthorizeUser(userData, socket) {
    return __awaiter(this, void 0, void 0, function* () {
        let alreadyExistingUser = yield Users.findOne({ username: userData.username });
        if (alreadyExistingUser === null || alreadyExistingUser === void 0 ? void 0 : alreadyExistingUser._id) {
            socket.emit('verification-error', 'username already taken');
            return false;
        }
        alreadyExistingUser = yield Users.findOne({ email: userData.email });
        if (alreadyExistingUser === null || alreadyExistingUser === void 0 ? void 0 : alreadyExistingUser._id) {
            socket.emit('verification-error', 'email already taken');
            return false;
        }
        try {
            const otp = generateOTP();
            yield sendMail(userData.email, otp);
            socket.emit('verify-otp', otp);
        }
        catch (e) {
            socket.emit('verification-error', 'invalid mail');
            return false;
        }
        userData.password = createHash('sha256').update(userData.password).digest('hex');
        socket.on('verified', () => __awaiter(this, void 0, void 0, function* () {
            yield Users.create(Object.assign({}, userData));
            socket.emit('signup-ok', userData.password);
        }));
        return true;
    });
}
function generateOTP() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let otp = '';
    let i = 0;
    while (i < 5)
        otp += numbers[Math.floor(Math.random() * numbers.length)].toString();
    return otp;
}
