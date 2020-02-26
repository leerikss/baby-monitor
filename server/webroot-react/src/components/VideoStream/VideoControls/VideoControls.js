import React, { useState, useEffect, useContext } from 'react'
import classes from './VideoControls.module.css';
import Button, { ButtonType } from '../../UI/Button/Button';
import { AppContext, AppContextActions, VideoStates } from '../../../context/AppContext';

// Constants 
export const ZOOM = 20;

const VideoControls = (props) => {

    const [togglePlay, setTogglePlay] = useState(ButtonType.PLAY);
    const [toggleMute, setToggleMute] = useState(ButtonType.MUTE);
    const { state, dispatch } = useContext(AppContext);

    // Manage play/pause button toggle via context changes
    useEffect(() => {
        if (state.videoState === VideoStates.PLAYING)
            setTogglePlay(ButtonType.PAUSE);
        else if(state.videoState === VideoStates.PAUSED)
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
        if (state.videoState === VideoStates.PAUSED) {
            dispatch({ type: AppContextActions.PLAY_VIDEO })
        } else if (state.videoState === VideoStates.PLAYING) {
            dispatch({ type: AppContextActions.PAUSE_VIDEO })
        }
    }

    const muteButtonHandler = () => {
        if (state.videoMuted) {
            dispatch({ type: AppContextActions.UNMUTE_VIDEO })
        } else {
            dispatch({ type: AppContextActions.MUTE_VIDEO })
        }
    }

    const zoomInHandler = () => {
        dispatch({ type: AppContextActions.ZOOM_VIDEO, zoom: ZOOM });
    }

    const zoomOutHandler = () => {
        dispatch({ type:  AppContextActions.ZOOM_VIDEO, zoom: -ZOOM });
    }

    const menuHandler = () => {
        const type = (state.menuOpen) ? AppContextActions.CLOSE_MENU : AppContextActions.OPEN_MENU;
        dispatch({ type: type });
    }

    return (
        <div className={classes.VideoControls}>
            <Button type={ButtonType.ZOOM_IN} clicked={zoomInHandler}/>
            <Button type={ButtonType.ZOOM_OUT} clicked={zoomOutHandler}/>
            <Button type={ButtonType.MENU} clicked={menuHandler}/>
            <Button clicked={playButtonHandler} type={togglePlay} />
            <Button clicked={muteButtonHandler} type={toggleMute} />
        </div>            
    )
}

export default VideoControls;