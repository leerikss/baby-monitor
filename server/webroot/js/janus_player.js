const janusPlayer = function() {

    let janus = null;
    let plugin = null;
    let onCleanup = null;
    let reInit = null;
    let config = {}

    const DEAD_STREAM_MS = 5000;

    function init(_config) {

        config = _config;

        Janus.init({
            debug: false, // true,
            dependencies: Janus.useDefaultDependencies(),
            callback: callback
        });
    }

    function callback() {

        janus = new Janus({

            server: config.url,
	    iceServers: [
		{
                    url: config.turnUrl,
                    username: 'babymonitor',
                    credential: config.pin,
                }
	    ],
	    
            success: function() {

                janus.attach({

                    plugin: "janus.plugin.streaming",

                    success: function(pluginHandle) {
                        plugin = pluginHandle;
                        requestStreams();
                    },

                    onmessage: function(msg, jsep) {
                        if (msg.result !== undefined && msg.result.status !== undefined) {
                            var status = msg.result.status;
                            console.log("onmessage: status = " + status);
                            if (status === "preparing" && jsep !== undefined)
                                createAnswer(jsep);
                        }
                    },

                    onremotestream: function(stream) {
                        console.log("Got a remote stream");
                        console.log(stream);
                        Janus.attachMediaStream(config.elVideo, stream);
                    },

                    oncleanup: function() {
                        console.log("Cleanup!");
                        if (onCleanup !== null) {
                            onCleanup();
                            onCleanup = null;
                        }
                    },

                    error: function(cause) {
                        console.error("janus.attach error", cause);
                    },
                });
            },

            error: function(error) {
                console.error("Janus error:");
                console.log(error);
                // Reinit gracefully
                if (reInit === null) {
                    reInit = setTimeout(() => {
                        console.log("Rerunning init()...");
                        init(config);
                        reInit = null;
                    }, 1000);
                }
            }
        });
    }

    function requestStreams() {
        plugin.send({
            "message": { "request": "list" },
            "success": (result) => {
                if (result !== undefined && result["list"] !== undefined)
                    streamsArrived(result["list"]);
            }
        });
    }

    function streamsArrived(streams) {
        console.log("Streams arrived");
        console.log(streams);
        streams = removeDeadStreams(streams);
        if (Array.isArray(streams) && streams.length > 0) {
            watchStream(streams[0]);
            buildDropdown(streams);
        }
    }

    function removeDeadStreams(streams) {
        let newStreams = [];
        streams.forEach(stream => {
            if (stream.video_age_ms < DEAD_STREAM_MS &&
                stream.audio_age_ms < DEAD_STREAM_MS)
                newStreams.push(stream);
        });
        return newStreams;
    }

    function watchStream(stream) {
        console.log("Requesting watch...");
        plugin.send({
            "message": {
                "request": "watch",
                id: stream.id,
                pin: config.pin
            }
        });
    }

    function buildDropdown(streams) {

        // Regenerate dropdown
        config.elStreams.innerHTML = "";

        streams.forEach((stream) => {
            let option = document.createElement("option");
            option.value = stream.id;
            option.appendChild(document.createTextNode(stream.description));
            config.elStreams.appendChild(option);
        });

        // Dropdown on change action
        config.elStreams.onchange = function() {
            const id = parseInt(this.value);
            onCleanup = () => {
                console.log("Requesting watch...");
                plugin.send({ "message": { "request": "watch", id: id, "pin": config.pin } });
            };
            plugin.send({ "message": { "request": "stop", "pin": config.pin } });
        };
    }

    function createAnswer(jsep) {

        console.log(jsep);

        console.log("Create answer");
        plugin.createAnswer({
            "pin": config.pin,
            "jsep": jsep,
            "media": { "audioSend": false, "videoSend": false },
            "success": (jsep) => requestStart(jsep),
            "error": function(error) {
                console.error("WebRTC error: ", error);
            }
        });
    }

    function requestStart(jsep) {
        console.log("Got SDP");
        plugin.send({
            "message": { "request": "start" },
            "pin": config.pin,
            "jsep": jsep
        });
    }

    return Object.freeze({
        init: init
    });

}();
