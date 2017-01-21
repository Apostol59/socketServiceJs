/**
 * Created by andrei bulatov on 18.01.2017.
 */
const PORT = 1337;
const io = require('socket.io')(PORT);
const admin = require('./handlers/adminHandler');
const adminHandler = new admin.AdminHandler();
const allSockets = {};
console.log(`${PORT} server started`);

io.on('connection', function (socket) {
    let tmpClientId = '';

    socket.emit('init');
    socket.on('init', function (id) {
        tmpClientId = id;
        allSockets[id] = socket;
        console.log(`${id} init`);
    });

    socket.on('privateMessage', function (message, id) {
        if (allSockets[id]) {
            allSockets[id].emit('privateMessage', {message: message, from: tmpClientId});
            console.log(`${tmpClientId} private for: ${id} data:  ${message}`);
        }
        else {
            console.error(`${tmpClientId} send to ${id}, error, id not found`)
        }
    });

    socket.on('sharedMessage', function (message) {
        console.log(`${tmpClientId} sharedMessage: ${message}`);
        socket.broadcast.emit('sharedMessage', message);
    });

    socket.on('admin', function (command) {
        if (allSockets[tmpClientId]) {
            console.log(`${tmpClientId} admin with command ${command}`);
            if (adminHandler[command]) {
                const answer = adminHandler[command](socket, allSockets);
                allSockets[tmpClientId].emit('admin', answer);
            }
            else {
                console.log(`error, ${command} not found`)
            }
        }
        else {
            console.error(` error, id not found`)
        }
    });

    socket.on('disconnect', function () {
        delete allSockets[tmpClientId];
        console.log(`${tmpClientId} client disconnected`);
    });
});