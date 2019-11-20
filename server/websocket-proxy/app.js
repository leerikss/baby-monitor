const WebSocketProxy = require("./websocket-proxy");
const AudioProxy = require("./audio-proxy");
const dotenv = require('dotenv');
dotenv.config();

// Music player WS proxy
new WebSocketProxy({
    host: "localhost",
    port: 8100,
    token: process.env.PASSWORD,
    origin: process.env.ORIGIN
}).start();

// Mic binary stream WS proxy
new AudioProxy({
    host: "localhost",
    port: 8200,
    token: process.env.PASSWORD,
    origin: process.env.ORIGIN
}).start();