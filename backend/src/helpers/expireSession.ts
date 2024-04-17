import { Socket } from "socket.io";

export default (socket: Socket) => {
    socket.emit('session-expired');
}