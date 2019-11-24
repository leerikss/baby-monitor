/*

Requirements:

  npm install ws

  sudo apt-get install omxplayer
  npm install node-omxplayer

*/


const MusicClient = function() {

    // Imported modules
    const WebSocket = require('ws')
    const fs = require('fs')
    let Omx = require('node-omxplayer');
    const crypto = require("crypto");

    // Private variables
    let player = null;
    let pingTimeout = null;
    let config = null;
    let songs = [];

    function run() {

        // Read configs
        const rawdata = fs.readFileSync('config.json');
        config = JSON.parse(rawdata);

        // Construct WebSocket
        configureWebSocket(
            new WebSocket(config.ws_music_url + "?role=receiver", config.token));
    }

    function configureWebSocket(client) {

        client.onopen = buildSongs;

        client.onerror = e => console.log("Music WS Client error: " + e.message);

        client.onmessage = (event) => onClientMessage(client, event);

        client.onclose = (event) => console.log("Music WS Client connection was closed");

        // Heartbeat
        client.on("open", heartbeat);
        client.on("ping", heartbeat);
        client.on("close", () => clearTimeout(pingTimeout));
    }

    function onClientMessage(client, event) {

        var msg = JSON.parse(event.data);

        switch (msg.request) {

            case "list_songs":
                var data = JSON.stringify({ "response": "list_songs", "songs": songs });
                console.log("Music WS Client list_songs() returns: " + data);
                client.send(data);
                break;

            case "play":
                if (player && player.running)
                    stop();
                play(msg.song, () => client.send(JSON.stringify({ "response": "play", "status": "playing" })));
                break;

            case "stop":
                stop();
                client.send(JSON.stringify({ "response": "stop", "status": "stopped" }));
                break;
        }
    }

    function buildSongs() {
        fs.readdir(config.music_path, function(err, items) {
            songs = [];
            items.forEach((item) => {
                songs.push({
                    id: crypto.randomBytes(16).toString("hex"),
                    name: item
                });
            });
        });
    }

    function play(songId, cb) {
        const song = songs.find(item => item.id === songId);
        if (song !== undefined && song.name !== undefined) {
            console.log("Music WS Client Playing " + song.name + "..");
            player = Omx(config.music_path + "/" + song.name);
            player.running = true;
            cb();
        }
    }

    function stop() {
        console.log("Music WS Client Stops playing...");
        if (player !== null) {
            player.quit();
            player.running = false;
        }
    }

    function heartbeat() {
        console.log("Music WS Client heartbeat...");
        clearTimeout(pingTimeout);
        pingTimeout = setTimeout(() => this.terminate(), 3000 * 2);
    }

    return {
        run: run
    }

}();

// Start
MusicClient.run();