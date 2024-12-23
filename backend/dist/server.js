var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Server } from "socket.io";
import dotenv from "dotenv";
import { InitMailer } from "./helpers/mail.js";
import AuthorizeUser from "./events/auth.js";
import mongoose from "mongoose";
import LoginUser from "./events/login.js";
import SendLogs from "./events/sendLogs.js";
import { Publish } from "./events/publish.js";
import { Like } from "./events/like.js";
import TopicInfo from "./events/topicInfo.js";
dotenv.config();
export const io = new Server({ cors: { origin: "*" } });
io.on("connection", socket => {
    socket.on('signup-verify', (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield AuthorizeUser(data, socket);
    }));
    socket.on('login', (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield LoginUser(data, socket);
    }));
    socket.on('get-logs', (sessionId, lastLogId, filterTag) => __awaiter(void 0, void 0, void 0, function* () {
        yield SendLogs(sessionId, lastLogId, filterTag, socket);
    }));
    socket.on('publish-log', (myLog) => __awaiter(void 0, void 0, void 0, function* () {
        yield Publish(myLog, socket);
    }));
    socket.on('log-liked', (likeLog) => __awaiter(void 0, void 0, void 0, function* () {
        yield Like(likeLog, socket);
    }));
    socket.on('get-hashtag-details', (topic, sessionId) => __awaiter(void 0, void 0, void 0, function* () {
        yield TopicInfo(topic, sessionId, socket);
    }));
});
function Init() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        InitMailer();
        console.log('📨 [mailer is ready]');
        io.listen(+((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000));
        console.log(`⚡ [listening to port: ${(_b = process.env.PORT) !== null && _b !== void 0 ? _b : 0}]`);
        mongoose.set('strictQuery', false);
        yield mongoose.connect(process.env.DB);
        console.log('📦 [connected to db]');
        console.log('\n🚀 [SERVER INITIALIZED]');
    });
}
Init();
