import { Server } from "socket.io";
import dotenv from "dotenv";
import { InitMailer } from "./helpers/mail.js";
import { AuthData, LoginData } from '../../types.js';
import AuthorizeUser from "./helpers/auth.js";
import mongoose from "mongoose";
import LoginUser from "./helpers/login.js";

dotenv.config();
const io = new Server({ cors: { origin: "*" } });

io.on("connection", socket => {
    socket.on('signup-verify', async (data: AuthData) => {
        await AuthorizeUser(data, socket);
    });

    socket.on('login', async (data: LoginData) => {
        await LoginUser(data, socket);
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
    console.log('\n🚀 [SERVER INITIALIZED]');
}
Init();