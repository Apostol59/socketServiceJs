/**
 * Created by andrei bulatov on 21.01.2017.
 */

class AdminHandler {
    getActiveIds(socket, allSockets){
        const ids = [];
        for (const id in allSockets) ids.push(id)
        return ids;
    }
    reInit(socket, allSockets){
        socket.broadcast.emit('init');
        return 'reInit done!'
    }
}

module.exports.AdminHandler = AdminHandler;