import React, { useState, useEffect, useContext, useRef } from 'react'

import classes from './VideoStream.module.css';
import VideoControls from './VideoControls/VideoControls';

import JanusVideo from './JanusVideo/JanusVideo';
import Animator from '../UI/Animator/Animator';
import { AppContext, AppContextActions } from '../../context/AppContext';

const HIDE_CONTROLS_MS = 3000;

const VideoStream = (props) => {

    const [showControls, setShowControls] = useState(false);
    const [state, dispatch] = useContext(AppContext);

    let timeout = useRef(null);

    useEffect(() => {
        if (state.controlsOpen) {
            if (timeout.current)
                clearTimeout(timeout.current);
            
            timeout.current = setTimeout(() => {
                timeout.current = null;
                dispatch({ type: AppContextActions.CLOSE_CONTROLS });
            }, HIDE_CONTROLS_MS);

            setShowControls(true);
        }
        else {
            if (!timeout.current)
                setShowControls(false);
            else clearTimeout(timeout.current);
        }
    }, [state.controlsOpen, dispatch]);

    return (
        <div className={classes.VideoStream}>
            <JanusVideo
                janusUrl={props.janusUrl}
                useTurn={props.useTurn}
                turnUrl={props.turnUrl}
                password={props.password} />
            <Animator show={showControls}>
                <VideoControls />
            </Animator>
        </div>
    )

}

export default VideoStream;