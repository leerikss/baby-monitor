import React, { useState } from 'react'

import classes from './VideoStream.module.css';
import VideoControls from './VideoControls/VideoControls';

import { JanusContextProvider } from './JanusPlayer/JanusContext';
import JanusPlayer from './JanusPlayer/JanusPlayer';

// TODO: Remove from github
const janusServerUrl = 'https://babies.leif.fi:8089/janus';
const janusStreamingPin = 'dw5QY8x8BtDqW4BtGJkK';

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