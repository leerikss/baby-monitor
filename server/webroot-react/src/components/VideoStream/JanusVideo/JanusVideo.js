import React, { useRef, useContext, useEffect } from 'react';
import { AppContext, AppContextActions, JanusVideoStates } from '../../../context/AppContext';
import classes from './JanusVideo.module.css';
import useJanus from '../../../hooks/janus/useJanus';

let initJanus = null, watchStream = null;

export const JanusVideo = (props) => {

    const videoEl = useRef(null);
    const { state, dispatch } = useContext(AppContext);
    ({ initJanus, watchStream } = useJanus(props.serverUrl, props.pin, videoEl));

    // On component renders
    useEffect(() => {
        if (props.pin === null)
            return
        initJanus();
    }, [props.pin]);

    // On new stream selected
    useEffect(() => {
        if (state.selectedJanusStream === null)
            return;
        watchStream( parseInt(state.selectedJanusStream) );
    }, [state.selectedJanusStream]);

    // Play/pause video
    useEffect(() => {
        if (state.videoState === JanusVideoStates.PAUSE)
            videoEl.current.pause();
        else if (state.videoState === JanusVideoStates.PLAY)
            videoEl.current.play();
    }, [state.videoState]);

    // mute/unmute video
    useEffect(() => {
        videoEl.current.muted = state.videoMuted;
    }, [state.videoMuted]);

    return (
        <video
            ref={videoEl}
            style={{ height: `${state.videoHeight}vh` }}
            className={classes.Video}
            autoPlay
            onPlay={() => { dispatch({ type: AppContextActions.VIDEO_PLAYING }) }}
            onPause={() => { dispatch({ type: AppContextActions.VIDEO_PAUSED }) }}
            playsInline></video>
    );
}

export default JanusVideo;