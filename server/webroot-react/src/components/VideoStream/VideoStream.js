import React, { useState } from 'react'

import classes from './VideoStream.module.css';
import VideoControls from './VideoControls/VideoControls';

import { JanusContextProvider } from './JanusPlayer/JanusContext';
import JanusPlayer from './JanusPlayer/JanusPlayer';

const VideoStream = () => {

    return (
        <JanusContextProvider>
            <div className={classes.VideoStream}>
                <JanusPlayer
                    serverUrl={process.env.JANUS_SERVER_URL}
                    pin={process.env.JANUS_PLUGIN_STREAMING_PIN} />
                <VideoControls />
            </div>
        </JanusContextProvider >
    )

}

export default VideoStream;