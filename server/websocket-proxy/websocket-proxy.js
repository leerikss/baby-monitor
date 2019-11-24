const http = require('http');
const WebSocket = require('ws')
const url = require('url');
const crypto = require("crypto");

module.exports = class WebSocketProxy {

    constructor(config) {
        this.config = config;
        this.config.host = config.host || "localhost";
        this.config.maxPayload = config.maxPayload || 100000;
        this.config.maxFailedTokens = config.maxFailedTokens || 20;
        this.config.pingInterval = config.pingInterval || 3000;
        this.bannedIps = {};
    }

    start() {
        console.log("Starting WSProxyServer at " + this.config.host + ":" + this.config.port);
        this.server = this.initWebSocketServer();
        this.initHttpServer(this.server);
        this.interval =
            setInterval(this.pingClient.bind(this),
                this.config.pingInterval);
    }

    initWebSocketServer() {
        const server = new WebSocket.Server({
            noServer: true,
            maxPayload: this.config.maxPayload
        });
        server.on("connection", (client, request) => this.onClientConnect(client, request));
        server.on("error", e => console.error("WebSocket.Server error: " + e));
        return server;
    }

    initHttpServer(server) {
        const httpServer = http.createServer();
        httpServer.on("upgrade", (request, socket) => {
            if (!this.isAuthenticated(request) ||
                // !this.isAllowedOrigin(request) ||
                !this.isAllowedRole(request)) {
                socket.destroy();
            } else
                server.handleUpgrade(request, socket, head, client => {
                    server.emit("connection", client, request);
                });
        });
        httpServer.listen(this.config.port);
    }

    isAuthenticated(request) {

        const ip = request.headers["x-real-ip"]
        const bip = this.bannedIps[ip];

        if (bip !== undefined && bip >= this.config.maxFailedTokens) {
            console.log("IP " + ip + " is banned (too many failed token attempts)!");
            return false;
        }

        const token = request.headers["Sec-WebSocket-Protocol"]
        if (token !== this.config.token) {
            console.log("Unauthorized token: " + token + ". IP = " + ip);
            this.bannedIps[ip] = (bip === undefined) ? 1 : bip + 1;
            return false;
        }

        if (bip !== undefined)
            delete this.bannedIps[ip];

        return true;
    }

    isAllowedOrigin(request) {
        const orig = request.headers.origin;
        if (orig !== this.config.origin) {
            console.error("Bad origin headers: " + orig);
            return false;
        }
        return true;
    }

    isAllowedRole(request) {
        const parts = url.parse(request.url, true);
        const role = parts.query.role;
        if (role === undefined ||
            (role !== "receiver" && role !== "transmitter")) {
            console.error("Invalid role '" + role + "'");
            return false;
        }
        return true;
    }

    onClientConnect(client, request) {
        client.alive = true;
        this.setClientId(client);
        this.setClientRole(client, request);
        console.log("New connection. id=" + client.id + ", role=" + client.role);
        this.connectionNotification(client);
        client.on("message", message => this.onClientMessage(client, message));
        client.on("error", e => this.onClientError(e));
        client.on("close", (code, reason) => this.onClientClose(client, code, reason));
        client.on("pong", () => this.onClientPong(client));
    }

    setClientId(client) {
        client.id = crypto.randomBytes(16).toString("hex");
    }

    setClientRole(client, request) {
        const parts = url.parse(request.url, true);
        client.role = parts.query.role;
    }

    connectionNotification(client) {
        const msg = {
            "receivers": this.getReceivers()
        }
        if (client.role === "transmitter")
            client.send(JSON.stringify(msg));
        else if (client.role === "receiver")
            this.broadcastTransmitters(JSON.stringify(msg));
    }

    getReceivers() {
        let sum = 0;
        let receivers = [];
        this.server.clients.forEach(client => {
            if (client.role === "receiver" && this.isAlive(client))
                receivers.push({ clientId: client.id });
        });
        return receivers;
    }

    isAlive(client) {
        return (client.alive && client.readyState === WebSocket.OPEN);
    }

    broadcastTransmitters(message) {
        this.server.clients.forEach(client => {
            if (client.role === "transmitter" && this.isAlive(client))
                client.send(message);
        });
    }

    onClientMessage(msgClient, message) {
        this.server.clients.forEach(client => {
            if (msgClient !== client && this.isAlive(client)) {
                var msg = JSON.parse(message);
                msg.clientId = client.id;
                client.send(JSON.stringify(msg));
            }
        });
    }

    onClientClose(client, code, reason) {
        console.log("Client " + client.id + " was closed: code '" + code + "' reason '" + reason + "'");

        if (client.role === "receiver")
            this.broadcastTransmitters(JSON.stringify({
                "receivers": this.getReceivers()
            }));
    }

    onClientError(e) {
        console.error("Socket " + this.id + " error: " + e.message);
    }

    pingClient() {
        this.server.clients.forEach(client => {
            if (client.alive === false) {
                console.log("Client " + client.id +
                    " has not responded to ping, terminating it.");
                client.terminate();
            }
            client.alive = false;
            client.ping(function() {});
        });
    }

    onClientPong(client) {
        console.log("Client " + client.id + " responded to ping");
        client.alive = true;
    }
}