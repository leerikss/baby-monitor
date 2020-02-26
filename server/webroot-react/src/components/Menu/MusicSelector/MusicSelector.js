import React from 'react'
import classes from './MusicSelector.module.css';

import PlaySong from './img/song-play-icon.png';
import StopSong from './img/song-stop-icon.png';

const MusicSelector = () => {

    return (
        <div class={classes.MusicSelector}>
            <select>
                <option>lullaby.mp3</option>
            </select>
            <img alt="Play/Stop Song" src={PlaySong} />
        </div>
    )
}

export default MusicSelector
