import React from 'react'

import classes from './Button.module.css';
import PropTypes from 'prop-types';

import Menu from './img/menu-icon.svg';
import Mute from './img/mute-on-icon.svg';
import Unmute from './img/mute-off-icon.svg';
import ZoomIn from './img/zoom-in-icon.svg';
import ZoomOut from './img/zoom-out-icon.svg';
import Play from './img/video-play-icon.svg';
import Pause from './img/video-pause-icon.svg';

export const ButtonType = {
    MUTE: 'mute',
    UNMUTE: 'unmute',
    ZOOM_IN: 'zoomIn',
    ZOOM_OUT: 'zoomOut',
    PLAY: 'play',
    PAUSE: 'pause',
    MENU: 'menu'
}
    
const Button = (props) => {


    let src = null;
    switch (props.type) {
        case ButtonType.MENU: {
            src = Menu;
            break;
        }
        case ButtonType.MUTE: {
            src = Mute;
            break;
        }
        case ButtonType.UNMUTE: {
            src = Unmute;
            break;
        }
        case ButtonType.ZOOM_IN: {
            src = ZoomIn;
            break;
        }
        case ButtonType.ZOOM_OUT: {
            src = ZoomOut;
            break;
        }
        case ButtonType.PLAY: {
            src = Play;
            break;
        }
        case ButtonType.PAUSE: {
            src = Pause;
            break;
        }
        default: {
            src = Menu;
        }
    }

    return (
        <img src={src}
            onClick={props.clicked}
            alt={props.type}
            className={`${classes[props.type]} ${classes.Button}`} />
    )
}

Button.propTypes = {
    type: PropTypes.oneOf(Object.values(ButtonType))
}

export default Button;