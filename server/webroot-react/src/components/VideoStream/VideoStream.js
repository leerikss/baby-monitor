import React, { useState } from 'react'

import classes from './VideoStream.module.css';
import VideoControls from './VideoControls/VideoControls';

import { JanusContextProvider } from './JanusPlayer/JanusContext';
import JanusPlayer from './JanusPlayer/JanusPlayer';
import { janusServerUrl, janusStreamingPin } from './config';

const VideoStream = () => {

    return (
        <JanusContextProvider>
            <div className={classes.VideoStream}>
                <JanusPlayer serverUrl={janusServerUrl} pin={janusStreamingPin}/>
                <VideoControls />
            </div>
        </JanusContextProvider >
    )

}

export default VideoStream;