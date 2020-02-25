import React, { useState, useEffect, useContext } from 'react'
import classes from './VideoControls.module.css';
import Button, { ButtonType } from '../../UI/Button/Button';
import { JanusContext, JanusContextActions, JanusVideoStates } from '../../../context/JanusContext';

// Constants 
export const ZOOM = 20;

const VideoControls = (props) => {

    const [togglePlay, setTogglePlay] = useState(ButtonType.PLAY);
    const [toggleMute, setToggleMute] = useState(ButtonType.MUTE);
    const { state, dispatch } = useContext(JanusContext);

    // Manage play/pause button toggle via context changes
    useEffect(() => {
        if (state.videoState === JanusVideoStates.PLAYING)
            setTogglePlay(ButtonType.PAUSE);
        else if(state.videoState === JanusVideoStates.PAUSED)
            setTogglePlay(ButtonType.PLAY);
    }, [state.videoState]);

    // Manage mute/unmute button toggle via context changes
    useEffect(() => {
        if (state.videoMuted)
            setToggleMute(ButtonType.UNMUTE);
        else
            setToggleMute(ButtonType.MUTE);
    }, [state.videoMuted]);

    // Button click handlers
    const playButtonHandler = () => {
        if (state.videoState === JanusVideoStates.PAUSED) {
            dispatch({ type: JanusContextActions.PLAY_VIDEO })
        } else if (state.videoState === JanusVideoStates.PLAYING) {
            dispatch({ type: JanusContextActions.PAUSE_VIDEO })
        }
    }

    const muteButtonHandler = () => {
        if (state.videoMuted) {
            dispatch({ type: JanusContextActions.UNMUTE_VIDEO })
        } else {
            dispatch({ type: JanusContextActions.MUTE_VIDEO })
        }
    }

    const zoomInHandler = () => {
        dispatch({ type: 'ZOOM_VIDEO', zoom: ZOOM });
    }

    const zoomOutHandler = () => {
        dispatch({ type: 'ZOOM_VIDEO', zoom: -ZOOM });
    }

    return (
        <div className={classes.VideoControls}>
            <Button type={ButtonType.ZOOM_IN} clicked={zoomInHandler}/>
            <Button type={ButtonType.ZOOM_OUT} clicked={zoomOutHandler}/>
            <Button type={ButtonType.MENU} />
            <Button clicked={playButtonHandler} type={togglePlay} />
            <Button clicked={muteButtonHandler} type={toggleMute} />
        </div>            
    )
}

export default VideoControls;