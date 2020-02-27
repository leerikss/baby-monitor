import React from 'react'

import classes from './Menu.module.css';
import JanusStreamSelector from './JanusStreamSelector/JanusStreamSelector';
import MusicSelector from './MusicSelector/MusicSelector';

const Menu = (props) => {

    return (
        <div className={classes.Menu}>
            <JanusStreamSelector />
            <MusicSelector
                password={props.password}
                serverUrl={process.env.REACT_APP_MUSIC_PLAYER_URL}
            />
        </div>
    );
}

export default Menu;