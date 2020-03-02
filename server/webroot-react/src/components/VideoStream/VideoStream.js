import React from 'react'

import classes from './VideoStream.module.css';
import VideoControls from './VideoControls/VideoControls';

import JanusVideo from './JanusVideo/JanusVideo';

const VideoStream = (props) => {

    return (
        <div className={classes.VideoStream}>
            <JanusVideo
                janusUrl={props.janusUrl}
                useTurn={props.useTurn}
                turnUrl={props.turnUrl}
                password={props.password} />
            <VideoControls />
        </div>
    )

}

export default VideoStream;