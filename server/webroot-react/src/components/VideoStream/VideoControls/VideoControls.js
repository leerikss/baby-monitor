import React, { useState, useContext } from 'react'
import classes from './VideoControls.module.css';
import Button, { ButtonType } from '../../UI/Button/Button';
import { JanusContext } from '../JanusPlayer/JanusContext';

// Constants
export const ZOOM = 20;

const VideoControls = (props) => {

    const {dispatch} = useContext(JanusContext);
    const [togglePlay, setTogglePlay] = useState(ButtonType.PLAY);
    const [toggleMute, setToggleMute] = useState(ButtonType.MUTE);

    const playButtonHandler = () => {
        if (togglePlay === ButtonType.PLAY) {
            setTogglePlay(ButtonType.PAUSE);
            dispatch({ type: 'PLAY_VIDEO' })
        } else {
            setTogglePlay(ButtonType.PLAY);
            dispatch({ type: 'PAUSE_VIDEO' })
        }
    }

    const muteButtonHandler = () => {
        if (toggleMute === ButtonType.UNMUTE) {
            setToggleMute(ButtonType.MUTE);
            dispatch({ type: 'UNMUTE_VIDEO' })
        } else {
            setToggleMute(ButtonType.UNMUTE);
            dispatch({ type: 'MUTE_VIDEO' })
        }
    }

    // Handler functions
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