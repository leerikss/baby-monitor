import React from 'react'
import classes from './MusicSelector.module.css';

import PlaySong from './img/song-play-icon.png';
// import StopSong from './img/song-stop-icon.png';
// import useMusicPlayer from '../../../hooks/musicPlayer/useMusicPlayer';

const MusicSelector = () => {

    // const { playerStatus } = useMusicPlayer();

    return (
        <div className={classes.MusicSelector}>
            <select>
                <option>lullaby.mp3</option>
            </select>
            <img alt="Play/Stop Song" src={PlaySong} />
        </div>
    )
}

export default MusicSelector
