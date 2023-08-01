import { Socket } from "socket.io";
import { AuthData } from "../../../types";
import { sendMail } from "./mail.js";
import Users from "../schema/Users.js";
import { sha } from "./funcs.js";

export default async function AuthorizeUser(userData: AuthData, socket: Socket) {
    let alreadyExistingUser = await Users.findOne({ email: userData.email });
    if (alreadyExistingUser?._id) {
        socket.emit('verification-error', 'email already taken');
        return false;
    }

    alreadyExistingUser = await Users.findOne({ username: userData.username });
    if (alreadyExistingUser?._id) {
        socket.emit('verification-error', 'username already taken');
        return false;
    }
    

    try {
        const otp = generateOTP();
        await sendMail(userData.email, otp.toString());
        socket.emit('verify-otp', otp);
    } catch (e) {
        socket.emit('verification-error', 'invalid mail');
        return false;
    }

    userData.password = sha(userData.password)

    socket.on('verified', async () => {
        alreadyExistingUser = await Users.findOne({ email: userData.email });
        if (alreadyExistingUser?._id) {
            if (alreadyExistingUser.password == userData.password) return false;
            else {
                /* 
                    --cut-chase situation--
                    someone else registered with same credential while user was verifying otp 
                */
               console.log('here')
               socket.emit('verification-error', 'email already taken');
               return false;
            }
        }

        // cut-chase
        alreadyExistingUser = await Users.findOne({ username: userData.username });
        if (alreadyExistingUser?._id && alreadyExistingUser.password != userData.password) {
            socket.emit('verification-error', 'username already taken');
            return false;
        }

        const sessionId = sha(Date.now().toString());

        await Users.create({
            ...userData,
            sessionId: {
                id: sessionId,
                setAt: Date.now().toString()
            }
        });

        socket.emit('entry-ok', sessionId);
    });
    return true;
}


function generateOTP() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let otp = '';
    for (let i = 0; i < 5; i++)
        otp += numbers[Math.floor(Math.random() * numbers.length)].toString();
    return otp;
}