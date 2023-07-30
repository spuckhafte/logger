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
import AuthorizeUser from "./helpers/auth.js";
dotenv.config();
const io = new Server({ cors: { origin: "*" } });
io.on("connection", socket => {
    socket.on('signup-verify', (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield AuthorizeUser(data, socket);
    }));
});
function Init() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        InitMailer();
        io.listen(+((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000));
    });
}
Init();
