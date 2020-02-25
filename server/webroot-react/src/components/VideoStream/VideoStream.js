import React from 'react'

import classes from './VideoStream.module.css';
import VideoControls from './VideoControls/VideoControls';

import JanusPlayer from './JanusPlayer/JanusPlayer';

const VideoStream = (props) => {

    return (
        <div className={classes.VideoStream}>
            <JanusPlayer
                serverUrl={props.serverUrl}
                pin={props.pin} />
            <VideoControls />
        </div>
    )

}

export default VideoStream;