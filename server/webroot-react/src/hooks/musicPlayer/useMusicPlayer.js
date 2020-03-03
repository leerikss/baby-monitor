import { useState, useRef, useMemo, useCallback } from "react"

export const MusicPlayerStatus = {
    PLAY: "PLAY",
    PLAYING: "PLAYING",
    STOP: "STOP",
    STOPPED: "STOPPED",
    AVAILABLE: "AVAILABLE",
    UNAVAILABLE: "UNAVAILABLE"
}

const useMusicPlayer = (url, password) => {

    const [status, setStatus] = useState(MusicPlayerStatus.UNAVAILABLE);
    const [songs, setSongs] = useState([]);

    const socket = useRef(null);
    const reconnect = useRef(null);

    const cleanUp = useCallback(() => {
        clearInterval(reconnect.current);
        reconnect.current = null;
    }, []);

    const send = useCallback((msg) => {
        if (socket.current.readyState === 1) {
            console.log("send():");
            console.log(msg);
            socket.current.send(JSON.stringify(msg));
        }
    }, []);

    const init = useCallback(() => {

        // Define WebSocket
        try {
            socket.current = new WebSocket(url + "?role=transmitter", password);
        } catch (e) {
            console.error(e);
            return;
        }
        
        socket.current.onopen = function (event) {
            console.log("WebSocket Connected!");
            cleanUp();
        }

        socket.current.onclose = event => {
            console.log("WebSocket closed. Attempting to reconnect...");
            setStatus(MusicPlayerStatus.UNAVAILABLE);
            if (reconnect.current === null) {
                reconnect.current = setInterval(init, 3000);
            }
        }

        socket.current.onmessage = function (event) {

            var msg = JSON.parse(event.data);

            console.log("onmessage():")
            console.log(msg);

            // Handle receivers list
            if (msg.receivers !== undefined) {
                if (msg.receivers.length > 0) {
                    setStatus(MusicPlayerStatus.AVAILABLE);
                    send({ "request": "list_songs" });
                } else
                    setStatus(MusicPlayerStatus.UNAVAILABLE);
            }

            // Handle server messages
            else if (msg.response !== undefined) {

                switch (msg.response) {

                    case "list_songs":
                        setSongs(msg.songs);
                        break;

                    case "play":
                        if (msg.status === "playing")
                            setStatus(MusicPlayerStatus.PLAYING);
                        break;

                    case "stop":
                        if (msg.status === "stopped")
                            setStatus(MusicPlayerStatus.STOPPED);
                        break;

                    default:
                        console.log("Received unknown msg:");
                        console.log(msg);
                        break;
                }
            }
        }
    }, [url, password, setSongs, cleanUp, send]);

    const play = useCallback((song) => {
        send({
            "request": "play",
            "song": song
        });
        setStatus(MusicPlayerStatus.PLAY);
    }, [send]);

    const stop = useCallback(() => {
        send({
            "request": "stop"
        });
        setStatus(MusicPlayerStatus.STOP);
    }, [send]);

    return useMemo(() => ({
        init: init,
        cleanUp: cleanUp,
        play: play,
        stop: stop,
        status: status,
        songs: songs,
    }), [init, cleanUp, play, stop, status, songs]);
}

export default useMusicPlayer;