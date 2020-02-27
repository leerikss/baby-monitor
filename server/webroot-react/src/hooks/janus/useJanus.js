import Janus from './Janus';
import { useEffect, useState, useRef } from 'react';

export const STREAM_TTL_MS = 5000;

const useJanus = (serverUrl, pin, videoEl) => {

    const [availableStreams, setAvailableStreams] = useState([]);

    let plugin = null;
    let running = false

    // Init
    useEffect(() => {
        console.log(pin);
        if (pin === null)
            return;
        init.current();
    }, [pin]);

    // Watch stream
    const watchStream = (streamId) => {
        if (plugin === null)
            return;

        const msg = {
            "message": {
                "request": (!running) ? "watch" : "switch",
                "id": streamId,
                pin: pin
            }
        };
        plugin.send(msg);
        console.log("setCurrentStream():");
        console.log(msg);
    };

    // Janus related code starts
    const janusCallback = () => {

        let rerunInit = null, janus = null, mediaAttached = false;

        janus = new Janus({
            server: serverUrl,

            success: () => {
                janus.attach({
                    plugin: "janus.plugin.streaming",

                    success: (pluginHandle) => {
                        plugin = pluginHandle;

                        request(
                            { "request": "list" },
                            {
                                "success": ({ list }) => {
                                    streamsArrived(list);
                                }
                            }
                        );
                    },

                    onmessage: (msg, jsep) => {

                        console.log("onMessage():");
                        console.log(msg);

                        const { result } = msg;
                        if (result === undefined || result.status === undefined)
                            return;

                        const { status } = result;
                        if (status === "preparing" && jsep !== undefined)
                            createAnswer(jsep);
                    },

                    onremotestream: (stream) => {
                        if (mediaAttached)
                            return;

                        console.log("onRemoteStream():");
                        console.log(stream);

                        Janus.attachMediaStream(videoEl.current, stream);

                        mediaAttached = true;
                        running = true;
                    },

                    error: (cause) => {
                        console.error("janus.attach error", cause);
                    }
                });
            },

            error: (error) => {

                console.error("Janus error:");
                console.log(error);

                // Reinit gracefully
                if (rerunInit === null) {
                    rerunInit = setTimeout(() => {
                        console.log("Rerunning init()...");
                        initJanus();
                        rerunInit = null;
                    }, 1000);
                }
            }
        })

        const request = (message, extra) => {
            const msg = {
                "message": {
                    ...message,
                    pin: pin
                },
                ...extra
            };
            plugin.send(msg);

            console.log("request():");
            console.log(msg);
        };

        const streamsArrived = (streams) => {

            console.log("streamsArrived():")
            console.log(streams);

            if (!Array.isArray(streams) || streams.length === 0)
                return;

            streams = streams
                .filter(stream => stream.video_age_ms < STREAM_TTL_MS &&
                    stream.audio_age_ms < STREAM_TTL_MS);

            setAvailableStreams(streams);
        }

        const createAnswer = (jsep) => {
            const msg = {
                "pin": pin,
                "jsep": jsep,
                "media": { "audioSend": false, "videoSend": false },
                "success": (jsep) => request({ "request": "start" }, { jsep: jsep }),
                "error": function (error) {
                    console.error("WebRTC error: ", error);
                }
            };
            plugin.createAnswer(msg);
            console.log("createAnswer():");
            console.log(msg);
        }
    };

    const initJanus = () => {
        console.log("initJanus()");
        running = false;
        Janus.init({
            debug: false, // true,
            dependencies: Janus.useDefaultDependencies(),
            callback: janusCallback
        });
    };
    const init = useRef(initJanus);

    return {
        availableStreams: availableStreams,
        watchStream: watchStream
    }
}

export default useJanus;