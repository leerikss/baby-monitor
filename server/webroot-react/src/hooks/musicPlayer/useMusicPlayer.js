import { useState } from "react"

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