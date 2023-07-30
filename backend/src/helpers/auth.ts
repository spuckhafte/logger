import { Socket } from "socket.io";
import { AuthData } from "../../types";
import { sendMail } from "./mail";
import Users from "../schema/Users";
import { createHash } from 'node:crypto';

export default async function AuthorizeUser(userData: AuthData, socket: Socket) {
    let alreadyExistingUser = await Users.findOne({ username: userData.username });
    if (alreadyExistingUser?._id) {
        socket.emit('verification-error', 'username already taken');
        return false;
    }

    alreadyExistingUser = await Users.findOne({ email: userData.email });
    if (alreadyExistingUser?._id) {
        socket.emit('verification-error', 'email already taken');
        return false;
    }

    try {
        const otp = generateOTP();
        await sendMail(userData.email, otp);
        socket.emit('verify-otp', otp);
    } catch (e) {
        socket.emit('verification-error', 'invalid mail');
        return false;
    }

    userData.password = createHash('sha256').update(userData.password).digest('hex');

    socket.on('verified', async () => {
        await Users.create({
            ...userData
        });

        socket.emit('signup-ok', userData.password);
    });
    return true;
}


function generateOTP() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let otp = '';
    let i = 0;
    while (i < 5) 
        otp += numbers[Math.floor(Math.random() * numbers.length)].toString();
    return otp;
}