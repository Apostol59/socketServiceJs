/**
 * Created by andrei bulatov on 21.01.2017.
 */


class AdminHandler {
    constructor(io) {
        this.io = io;
        this.debugSubscribers = new Map();
        this.errorSubscribers = new Map();
    }

    getActiveIds(parameters) {
        const ids = [];
        for (const id in parameters.allSockets) ids.push(id)
        return ids;
    }

    reInit(parameters) {
        parameters.socket.broadcast.emit('init');
        return 'reInit done!'
    }

    subscribeDebug(parameters) {
        this.debugSubscribers.set(parameters.tmpClientId, parameters.socket);
    }

    unsubscribeDebug(parameters) {
        if (this.debugSubscribers.has(parameters.tmpClientId))
            this.debugSubscribers.delete(parameters.tmpClientId);
    }

    subscribeError(parameters) {
        this.errorSubscribers.set(parameters.tmpClientId, parameters.socket);
    }

    unsubscribeError(parameters) {
        if (this.errorSubscribers.has(parameters.tmpClientId))
            this.errorSubscribers.delete(parameters.tmpClientId);
    }

    log(message) {
        console.log(message);
        if (this.debugSubscribers)
            this.debugSubscribers.forEach((socket, tmpClientId, map) => {
                socket.emit("debugMsg", message);
            });
    }

    error(message) {
        console.error(message);
        if (this.errorSubscribers)
            this.errorSubscribers.forEach((socket, tmpClientId, map) => {
                socket.emit("errorMsg", message);
            });
    }

    disconnected(tmpClientId) {
        let params = {tmpClientId: tmpClientId};
        this.unsubscribeError(params);
        this.unsubscribeDebug(params);
    }

}

module.exports.AdminHandler = AdminHandler;