import React from 'react'

import classes from './VideoStream.module.css';
import VideoControls from './VideoControls/VideoControls';

import JanusVideo from './JanusVideo/JanusVideo';

const VideoStream = (props) => {

    return (
        <div className={classes.VideoStream}>
            <JanusVideo
                serverUrl={props.serverUrl}
                pin={props.pin} />
            <VideoControls />
        </div>
    )

}

export default VideoStream;