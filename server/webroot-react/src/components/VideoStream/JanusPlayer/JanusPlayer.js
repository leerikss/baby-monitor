import Janus  from './Janus';
import React, { useRef, useContext, useEffect } from 'react';
import { JanusContext } from '../../../context/JanusContext';
import classes from './JanusPlayer.module.css';

export const JanusPlayer = (props) => {
    
    const videoDom = useRef(null);

    const { state, dispatch } = useContext(JanusContext);

    // Init
    useEffect(() => {
        init();
        return () => {
            console.log("Cleanup");
            // TODO
        };
    }, [props.serverUrl]);    

    // Play/pause video
    useEffect(() => {
        if (state.videoPaused)
            videoDom.current.pause();
        else
            videoDom.current.play();
    }, [state.videoPaused]);    

    // mute/unmute video
    useEffect(() => {
        videoDom.current.muted = state.videoMuted;
    }, [state.videoMuted]);    

    let plugin = null;
    let reInit = null;
    let janus = null;

    const init = () => {
        // Init Janus
        Janus.init({
            debug: false, // true,
            dependencies: Janus.useDefaultDependencies(),
            callback: callback
        });
    }

    const watchStream = (stream) => {
        console.log("Requesting watch...");
        plugin.send({
            "message": {
                "request": "watch",
                id: stream.id,
                pin: props.pin
            }
        });
    }

    const streamsArrived = (streams) => {
        console.log("Streams arrived");
        if (Array.isArray(streams) && streams.length > 0) {
            watchStream(streams[0]);
            dispatch({ type: 'NEW_STREAM' }, { janusStream: streams[0] } );
        }
    }

    const requestStreams = () => {
        plugin.send({
            "message": { "request": "list" },
            "success": (result) => {
                if (result !== undefined && result["list"] !== undefined)
                    streamsArrived(result["list"]);
            }
        });
    }

    const requestStart = (jsep) => {
        console.log("Got SDP");
        plugin.send({
            "message": { "request": "start" },
            "pin": props.pin,
            "jsep": jsep
        });
    }


    const createAnswer = (jsep) => {
        console.log("Create answer");
        plugin.createAnswer({
            "pin": props.pin,
            "jsep": jsep,
            "media": { "audioSend": false, "videoSend": false },
            "success": (jsep) => requestStart(jsep),
            "error": function(error) {
                console.error("WebRTC error: ", error);
            }
        });
    }

    const callback = () => {

        console.log("SERVER: "+props.serverUrl);

        janus = new Janus({

            server: props.serverUrl,
            
            success: function () {

                janus.attach({

                    plugin: "janus.plugin.streaming",

                    success: function (pluginHandle) {
                        plugin = pluginHandle;
                        requestStreams();
                    },

                    onmessage: function (msg, jsep) {
                        if (msg.result !== undefined && msg.result.status !== undefined) {
                            var status = msg.result.status;
                            console.log("onmessage: status = " + status);
                            if (status === "preparing" && jsep !== undefined)
                                createAnswer(jsep);
                        }
                    },

                    onremotestream: function (stream) {
                        console.log("Got a remote stream");
                        console.log(stream);
                        Janus.attachMediaStream(videoDom.current, stream);
                    },

                    oncleanup: function () {
                        console.log("Cleanup!");
                        // TODO
                        /*
                        if (onCleanup !== null) {
                            onCleanup();
                            onCleanup = null;
                        }
                        */
                    },

                    error: function (cause) {
                        console.error("janus.attach error", cause);
                    }
                });
            },

            error: function(error) {
                console.error("Janus error:");
                console.log(error);
                // Reinit gracefully
                if (reInit === null) {
                    reInit = setTimeout(() => {
                        console.log("Rerunning init()...");
                        init();
                        reInit = null;
                    }, 1000);
                }
            }
        })
    };

    return (
        <video
            ref={videoDom}
            style={{ height: `${state.videoHeight}vh` }}
            className={classes.Video}
            autoPlay
            playsInline></video>
    );
}

export default JanusPlayer;