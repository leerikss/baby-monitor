/*
Requirements:

  npm install ws

  sudo apt-get install libasound2-dev
  npm install speaker

*/

const SpeakerClient = function() {

    // Imported modules
    const WebSocket = require('ws')
    const fs = require('fs')
    const Speaker = require('speaker')

    // Private variables
    let pingTimeout = null;
    let config = null;

    function run() {

        // Read config
        const rawdata = fs.readFileSync('config.json');
        config = JSON.parse(rawdata);

        // Construct WebSocket
        configureWebSocket(
            new WebSocket(config.ws_audio_url + "?role=receiver", config.token));
    }

    function configureWebSocket(client) {

        client.onopen = event => onClientOpen(client, event);

        client.onerror = event => console.log("Audio WS Client error: " + event.message);

        client.onclose = event => console.log("Audio WS Client connection was closed");

        // Heartbeat
        client.on("open", heartbeat);
        client.on("ping", heartbeat);
        client.on("close", () => clearTimeout(pingTimeout));
    }

    function onClientOpen(client, event) {
        // Pipe binary data to speaker
        const speaker = new Speaker({
            channels: 1, // 1 channel
            bitDepth: 16, // 16-bit samples
            sampleRate: 48000 // 44,800 Hz sample rate
        });
        const duplex = WebSocket.createWebSocketStream(client);
        duplex.pipe(speaker);
    }

    function heartbeat() {
        console.log("Audio WS Client heartbeat...");
        clearTimeout(pingTimeout);
        pingTimeout = setTimeout(() => this.terminate(), 3000 * 2);
    }

    return {
        run: run
    }
}();

// Start
SpeakerClient.run();