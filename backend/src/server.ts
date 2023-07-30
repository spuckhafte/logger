import { Server } from "socket.io";
import dotenv from "dotenv";
import { InitMailer } from "./helpers/mail.js";
import { AuthData } from '../../types.js';
import AuthorizeUser from "./helpers/auth.js";

dotenv.config();
const io = new Server({ cors: { origin: "*" } });

io.on("connection", socket => {
    socket.on('signup-verify', async (data: AuthData) => {
        await AuthorizeUser(data, socket);
    });
});

async function Init() {
    InitMailer();
    io.listen(+(process.env.PORT ?? 3000));
}
Init();