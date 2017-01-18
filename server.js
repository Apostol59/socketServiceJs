/**
 * Created by andrei bulatov on 18.01.2017.
 */
const PORT = 1337;
const io = require('socket.io')(PORT);
const allSockets = {};
console.log(`${PORT} server started`);

io.on('connection', function (socket) {
    let tmpClientId = '';

    socket.on('init', function (id) {
        tmpClientId = id;
        allSockets[id] = socket;
        console.log(`${id} init`);
    });

    socket.on('privateMessage', function (message, id) {
        if (id in allSockets) {
            allSockets[id].emit('privateMessage', {message: message, from: tmpClientId});
            console.log(`${tmpClientId} private for: ${id} data:  ${message}`);
        }
        else {
            console.log(`${tmpClientId} send to ${id}, error, id not found`)
        }
    });

    socket.on('sharedMessage', function (message) {
        console.log(`${tmpClientId} sharedMessage: ${message}`);
        socket.broadcast.emit('sharedMessage', message);
    });

    socket.on('admin', function (command) {
        console.log(`${tmpClientId} admin with command ${command}`);
        let answer = '';
        switch (command) {
            case "getActiveIds":
                let ids = [];
                for (let id in allSockets)
                    ids.push(id);
                answer = ids;
                break;
        }
        allSockets[tmpClientId].emit('admin', answer);
    });

    socket.on('disconnect', function () {
        delete allSockets[tmpClientId];
        console.log(`${tmpClientId} client disconnected`);
    });
});