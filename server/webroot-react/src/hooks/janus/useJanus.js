import Janus from './Janus';
import { useMemo, useCallback, useState, useRef } from 'react';

export const STREAM_TTL_MS = 5000;

const useJanus = (janusUrl, password, videoEl, useTurn, turnUrl) => {

    const [availableStreams, setAvailableStreams] = useState([]);

    let plugin = useRef(null);
    let running = useRef(false);
    let restart = useRef(null);

    // Exposed method: init
    const init = useCallback(() => {

        // Janus callback method
        const janusCallback = () => {

            let janus = null, mediaAttached = false;

            const iceServers = useTurn && turnUrl && turnUrl.length &&[
                {
                    url: turnUrl,
                    username: 'babymonitor',
                    credential: password,
                }
            ];

            console.log("iceServers:");
            console.log(iceServers);

            janus = new Janus({
                
                server: janusUrl,

                iceServers: iceServers,

                success: () => {
                    janus.attach({
                        plugin: "janus.plugin.streaming",

                        success: (pluginHandle) => {
                            plugin.current = pluginHandle;

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
                            running.current = true;
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
                    if (restart.current === null) {
                        restart.current = setTimeout(() => {
                            console.log("Rerunning init()...");
                            initJanus();
                            restart.current = null;
                        }, 1000);
                    }
                }
            })

            const request = (message, extra) => {
                const msg = {
                    "message": {
                        ...message,
                        pin: password
                    },
                    ...extra
                };
                plugin.current.send(msg);

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
                    "pin": password,
                    "jsep": jsep,
                    "media": { "audioSend": false, "videoSend": false },
                    "success": (jsep) => request({ "request": "start" }, { jsep: jsep }),
                    "error": function (error) {
                        console.error("WebRTC error: ", error);
                    }
                };
                plugin.current.createAnswer(msg);
                console.log("createAnswer():");
                console.log(msg);
            }
        };

        // Init Janus method
        const initJanus = () => {
            console.log("initJanus()");
            running.current = false;
            Janus.init({
                debug: false, // true,
                dependencies: Janus.useDefaultDependencies(),
                callback: janusCallback
            });
        }

        initJanus();

    }, [janusUrl, turnUrl, password, videoEl, useTurn]);

    const cleanUp = useCallback(() => {
        clearTimeout(restart.current);
        restart.current = null;
    },[]);

    // Exposed method: Watch stream
    const watchStream = useCallback((streamId) => {
        
        console.log("Running:");
        console.log(running.current);

        if (plugin.current === null)
            return;

        const msg = {
            "message": {
                "request": (!running.current) ? "watch" : "switch",
                "id": streamId,
                pin: password
            }
        };
        plugin.current.send(msg);
        console.log("setCurrentStream():");
        console.log(msg);

    }, [plugin,password,running] );

    return useMemo( () => ( {
        init: init,
        cleanUp: cleanUp,
        availableStreams: availableStreams,
        watchStream: watchStream
    }), [init,availableStreams,watchStream,cleanUp] );
};

export default useJanus;