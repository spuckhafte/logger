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
import TopicInfo from "./events/topicInfo.js";
import { createClient, RedisClientType } from "redis";

dotenv.config();
export const io = new Server({ cors: { origin: "*" } });
export let cache = createClient({
    url: process.env.REDIS as string,
    socket: {
        connectTimeout: 100 * 1000
    }
});

io.on("connection", socket => {
    socket.on('signup-verify', async (data: AuthData) => {
        await AuthorizeUser(data, socket);
    });

    socket.on('login', async (data: LoginData) => {
        await LoginUser(data, socket);
    });

    socket.on('get-logs', async (sessionId: string, lastLogId: string | null, filterTag: string | null) => {
        await SendLogs(sessionId, lastLogId, filterTag, socket);
    });

    socket.on('publish-log', async (myLog: PublishLog) => {
        await Publish(myLog, socket);
    });

    socket.on('log-liked', async (likeLog: LikeLog) => {
        await Like(likeLog, socket);
    });

    socket.on('get-hashtag-details', async (topic: string, sessionId: string) => {
        await TopicInfo(topic, sessionId, socket);
    });

    socket.on('disconnect', () => {
        cache.json.del(socket.id, '.');
    })
});

async function Init() {
    InitMailer();
    console.log('📨 [mailer is ready]')

    io.listen(+(process.env.PORT ?? 3000));
    console.log(`⚡ [listening to port: ${process.env.PORT ?? 0}]`);

    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.DB as string);
    console.log('📦 [connected to db]');
    
    await cache.connect();
    console.log('📄 [connected to redis]');

    console.log('\n🚀 [SERVER INITIALIZED]');
}
Init();