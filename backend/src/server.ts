import { Server } from "socket.io";
import dotenv from "dotenv";
import { InitMailer } from "./helpers/mail.js";
import { AuthData, LikeLog, LoginData, PublishLog } from '../../types.js';
import AuthorizeUser from "./events/auth.js";
import mongoose from "mongoose";
import LoginUser from "./events/login.js";
import SendLogs from "./events/sendLogs.js";
import { Publish } from "./events/publish.js";
import { Like } from "./events/like.js";

dotenv.config();
export const io = new Server({ cors: { origin: "*" } });

io.on("connection", socket => {
    socket.on('signup-verify', async (data: AuthData) => {
        await AuthorizeUser(data, socket);
    });

    socket.on('login', async (data: LoginData) => {
        await LoginUser(data, socket);
    });

    socket.on('get-logs', async (sessionId: string, lastLogId: string | null, filterTag: string|null) => {
        await SendLogs(sessionId, lastLogId, filterTag, socket);
    });

    socket.on('publish-log', async (myLog: PublishLog) => {
        await Publish(myLog, socket);
    });

    socket.on('log-liked', async (likeLog: LikeLog) => {
        await Like(likeLog, socket);
    });
});

async function Init() {
    InitMailer();
    console.log('📨 [mailer is ready]')

    io.listen(+(process.env.PORT ?? 3000));
    console.log(`⚡ [listening to port: ${process.env.PORT ?? 0}]`);

    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB as string);
    console.log('📦 [connected to db]');
    console.log('\n🚀 [SERVER INITIALIZED]');
}
Init();