/**
 * Created by andrei bulatov on 21.01.2017.
 */


class AdminHandler {
    constructor (io){
        this.io = io;
    }
    getActiveIds(socket, allSockets){
        const ids = [];
        for (const id in allSockets) ids.push(id)
        return ids;
    }
    reInit(socket, allSockets){
        socket.broadcast.emit('init');
        return 'reInit done!'
    }
    subscribeDebug(socket, allSockets){
        this.debugSubscribers = true;
    }
    unsubscribeDebug(socket, allSockets){
        this.debugSubscribers = false;
    }
    subscribeError(socket, allSockets){
        this.errorSubscribers = true;
    }
    unsubscribeError(socket, allSockets){
        this.errorSubscribers = false;
    }
    log(message){
        console.log(message);
        if(this.debugSubscribers)
            this.io.emit("debug", message);
    }
    error(message){
        console.error(message);
        if(this.errorSubscribers)
            this.io.emit("error", message);
    }

}

module.exports.AdminHandler = AdminHandler;