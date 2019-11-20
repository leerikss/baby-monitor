broadcastMic = function() {

    let socket = null;
    let config = null;
    let reconnect = null;
    let events = {};
    let mediaStream = null;
    let context = null;
    let recording = false;
    let AudioContext = window.AudioContext || window.webkitAudioContext;

    function init(_config) {
        config = _config;
        initWebSocket();
    }

    function addEventListener(event, func) {
        events[event] = func;
    }

    function start() {
        if (mediaStream === null)
            navigator
            .mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then(handleSuccess);
    }

    function stop() {
        if (context !== null)
            context.close();
        if (mediaStream !== null)
            mediaStream.getTracks().forEach(t => { t.stop(); });
        context = mediaStream = null;
        recording = false;
    }

    function isRecording() {
        return recording;
    }

    function initWebSocket() {

        socket = new WebSocket(config.url + "?token=" +
            config.token + "&role=transmitter");

        socket.onopen = event => {
            console.log("WebSocket Connected!");
            endReconnectLoop();
        }

        socket.onmessage = event => {

            var msg = JSON.parse(event.data);

            if (msg.receivers !== undefined)
                runEvent("receivers", msg.receivers);
        }

        socket.onclose = event => {
            console.log("WebSocket closed. Attempting to reconnect...");
            runEvent("closed");
            startReconnectLoop();
        }
    }

    function startReconnectLoop() {
        if (reconnect === null)
            reconnect = setInterval(initWebSocket, 5000)
    }

    function endReconnectLoop() {
        clearInterval(reconnect);
        reconnect = null;
    }

    function runEvent(name, arg1) {
        if (typeof events[name] === "function")
            events[name](arg1);
    }

    function getUserMedia(constraints) {
        return userMedia(constraints);
    }

    function handleSuccess(stream) {
        mediaStream = stream;
        context = new AudioContext();
        const source = context.createMediaStreamSource(stream);
        const processor = context.createScriptProcessor(config.buffer, 1, 1);
        source.connect(processor);
        processor.connect(context.destination);
        processor.onaudioprocess = recorderProcess;
        recording = true;
    };


    function recorderProcess(e) {
        var left = e.inputBuffer.getChannelData(0)
        if (socket !== null && socket.readyState === 1)
            socket.send(convertFloat32ToInt16(left))
    }

    function convertFloat32ToInt16(buffer) {
        l = buffer.length
        buf = new Int16Array(l)
        while (l--) {
            buf[l] = Math.min(1, buffer[l]) * 0x7fff
        }
        return buf.buffer
    }

    return {
        init: init,
        addEventListener: addEventListener,
        start: start,
        stop: stop,
        isRecording: isRecording
    }

}();