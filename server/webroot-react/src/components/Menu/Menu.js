import React from 'react'

import classes from './Menu.module.css';
import JanusStreamSelector from './JanusStreamSelector/JanusStreamSelector';
import MusicSelector from './MusicSelector/MusicSelector';

const Menu = (props) => {

    return (
        <div className={classes.Menu}>
            <JanusStreamSelector />
            <MusicSelector />
        </div>
    );
}

export default Menu;