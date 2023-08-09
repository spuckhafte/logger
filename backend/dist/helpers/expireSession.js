export default (socket) => {
    socket.emit('session-expired');
};
