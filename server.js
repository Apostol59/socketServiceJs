/**
 * Created by andrei bulatov on 18.01.2017.
 */
const PORT = 1337;
const io = require('socket.io')(PORT);
const admin = require('./handlers/adminHandler');
const adminHandler = new admin.AdminHandler(io);
const allSockets = {};
console.log(`${PORT} server started`);

io.on('connection', function (socket) {
    let tmpClientId = '';

    socket.emit('init');
    socket.on('init', function (id) {
        tmpClientId = id;
        allSockets[id] = socket;
        adminHandler.log(`${id} init`);
    });

    socket.on('privateMessage', function (message, id) {
        if (allSockets[id]) {
            allSockets[id].emit('privateMessage', {message: message, from: tmpClientId});
            adminHandler.log(`${tmpClientId} private for: ${id} data:  ${message}`);
        }
        else {
            adminHandler.error(`${tmpClientId} send to ${id}, error, id not found`)
        }
    });

    socket.on('sharedMessage', function (message) {
        adminHandler.log(`${tmpClientId} sharedMessage: ${message}`);
        socket.broadcast.emit('sharedMessage', message);
    });

    socket.on('admin', function (command) {
        if (allSockets[tmpClientId]) {
            adminHandler.log(`${tmpClientId} admin with command ${command}`);
            if (adminHandler[command]) {
                const answer = adminHandler[command]({
                    socket: socket,
                    tmpClientId: tmpClientId,
                    allSockets: allSockets
                });
                allSockets[tmpClientId].emit('admin', answer);
            }
            else {
                adminHandler.log(`error, ${command} not found, id ${tmpClientId}`)
            }
        }
        else {
            adminHandler.error(`${tmpClientId} error, id not found`)
        }
    });

    socket.on('disconnect', function () {
        adminHandler.disconnected(tmpClientId);
        delete allSockets[tmpClientId];
        adminHandler.log(`${tmpClientId} client disconnected`);
    });
});