import { useState } from "react"

export const STATUS = {
    PLAY: "play",
    PLAYING: "playing",
    STOP: "stop"
    STOPPED: "stopped"
}

const useMusicPlayer = () => {

    const [status, setStatus] = useState('stopped');

    const init = () => {
        // TODO: initialize websocket
    }

    return {
        init,
        status: status
    }
}

export default useMusicPlayer;