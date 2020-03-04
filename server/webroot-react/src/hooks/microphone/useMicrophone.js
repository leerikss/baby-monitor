import { useState, useRef, useMemo, useCallback } from "react"

export const MicrophoneStatus = {
    RECORDING: "RECORDING",
    STOPPED: "STOPPED",
    AVAILABLE: "AVAILABLE",
    UNAVAILABLE: "UNAVAILABLE"
}

export const AUDIO_BUFFER = 4096;

const useMicrophone = (url, password) => {

    const [status, setStatus] = useState(MicrophoneStatus.UNAVAILABLE);

    const socket = useRef(null);
    const reconnect = useRef(null);
    const mediaStream = useRef(null);
    const context = useRef(null);

    const stop = useCallback(() => {
        if (context.current !== null)
            context.current.close();
        if (mediaStream.current !== null)
            mediaStream.current.getTracks().forEach(t => { t.stop(); });
        context.current = mediaStream.current = null;
        setStatus(MicrophoneStatus.STOPPED);
    }, []);

    // Remove possible interval
    const cleanUp = useCallback(() => {
        stop();
        clearInterval(reconnect.current);
        reconnect.current = null;
    }, [stop]);

    // Initialize
    const init = useCallback(() => {

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
            setStatus(MicrophoneStatus.UNAVAILABLE);
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
                if (msg.receivers.length > 0)
                    setStatus(MicrophoneStatus.AVAILABLE);
                else
                    setStatus(MicrophoneStatus.UNAVAILABLE);
            }
        }
    }, [url, password, cleanUp]);

    const audioProcessor = useCallback( (audio) => {
        var mono = audio.inputBuffer.getChannelData(0)
        if (socket.current !== null && socket.current.readyState === 1)
            socket.current.send(convertFloat32ToInt16(mono))
    }, []);

    const convertFloat32ToInt16 = (buffer) => {
        let len = buffer.length;
        const buf = new Int16Array(len);
        while (len--) {
            buf[len] = Math.min(1, buffer[len]) * 0x7fff
        }
        return buf.buffer
    }

    const record = useCallback( () => {

        if (mediaStream.current !== null)
            return;

        navigator
            .mediaDevices
            .getUserMedia({ audio: true, video: false })
            .then((stream) => {
                mediaStream.current = stream;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                context.current = new AudioContext();
                const source = context.current.createMediaStreamSource(stream);
                const processor = context.current.createScriptProcessor(AUDIO_BUFFER, 1, 1);
                source.connect(processor);
                processor.connect(context.current.destination);
                processor.onaudioprocess = audioProcessor;

                setStatus(MicrophoneStatus.RECORDING);

            });
    }, [audioProcessor]);

    return useMemo(() => ({
        init: init,
        cleanUp: cleanUp,
        record: record,
        stop: stop,
        status: status
    }), [init, cleanUp, record, stop, status]);
}

export default useMicrophone;