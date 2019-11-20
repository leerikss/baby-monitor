const WebSocketProxy = require("./websocket-proxy");
const WebSocket = require('ws')

module.exports = class AudioProxy extends WebSocketProxy {

    constructor(config) {
        super(config);
    }

    onClientMessage(msgClient, message) {
        this.server.clients.forEach(client => {
            if (msgClient !== client &&
                client.role === "receiver" &&
                super.isAlive(client))
                client.send(message);
        });
    }

}