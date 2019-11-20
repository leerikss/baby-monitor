musicPlayer = function() {

    let selectedSong = null;
    let socket = null;
    let config = null;
    let reconnect = null;
    let events = {};
    let playing = false;

    function init(_config) {
        config = _config;
        initWebSocket();
    }

    function addEventListener(event, func) {
        events[event] = func;
    }

    function play(song) {
        send({ "request": "play", "song": song });
    }

    function stop() {
        send({ "request": "stop" });
    }

    function initWebSocket() {

        socket = new WebSocket(config.url + "?token=" +
            config.token + "&role=transmitter");

        socket.onopen = function(event) {
            console.log("WebSocket Connected!");
            endReconnectLoop();
        }

        socket.onmessage = function(event) {

            var msg = JSON.parse(event.data);

            if (msg.receivers !== undefined) {
                console.log("Receivers list: ");
                console.log(msg.receivers);
                runEvent("receivers", msg.receivers);
                send({ "request": "list_songs" });
            } else if (msg.response !== undefined) {

                switch (msg.response) {

                    case "list_songs":
                        runEvent("listsongs", msg);

                    case "play":
                        if (msg.status === "playing") {
                            playing = true;
                            runEvent("playing");
                        }

                    case "stop":
                        if (msg.status === "stopped") {
                            playing = false;
                            runEvent("stopped");
                        }
                }
            }
        }

        socket.onclose = event => {
            console.log("WebSocket closed. Attempting to reconnect...");
            runEvent("closed");
            startReconnectLoop();
        }
    }

    function startReconnectLoop() {
        if (reconnect === null)
            reconnect = setInterval(initWebSocket, 3000)
    }

    function endReconnectLoop() {
        clearInterval(reconnect);
        reconnect = null;
    }

    function runEvent(name, arg1) {
        if (typeof events[name] === "function")
            events[name](arg1);
    }

    function isPlaying() {
        return playing;
    }

    function send(msg) {
        if (socket.readyState === 1)
            socket.send(JSON.stringify(msg));
    }

    return {
        init: init,
        addEventListener: addEventListener,
        play: play,
        stop: stop,
        isPlaying: isPlaying
    }

}();