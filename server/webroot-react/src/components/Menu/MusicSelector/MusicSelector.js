import React, { useEffect, useState, useRef } from 'react'
import classes from './MusicSelector.module.css';

import PlaySong from './img/song-play-icon.png';
import StopSong from './img/song-stop-icon.png';
import useMusicPlayer, { MusicPlayerStatus } from '../../../hooks/musicPlayer/useMusicPlayer';

const MusicSelector = (props) => {

    const { init, cleanUp, play, stop, status, songs } = useMusicPlayer(props.serverUrl, props.password);
    const [options, setOptions] = useState(null);
    const [selectedSongId, setSelectedSongId] = useState(null);
    const btnRef = useRef(null);

    // Component rendered
    useEffect(() => {
        init();
        return () => {
            cleanUp();
        }
    }, [init, cleanUp]);

    // Build song options
    useEffect(() => {

        if (songs.length === 0)
            return;

        setSelectedSongId(songs[0].id);

        setOptions(songs.map((song) => {
            return (<option
                key={song.id}
                value={song.id}>{song.name}</option>);
        }));

    }, [songs])

    // React on status changes
    useEffect(() => {
        switch (status) {
            case MusicPlayerStatus.UNAVAILABLE:
                return;
            case MusicPlayerStatus.PLAYING:
                btnRef.current.src = StopSong;
                break;
            default:
                btnRef.current.src = PlaySong;
                break;
        }

    }, [status]);

    // Handlers
    const selectChangeHandler = (event) => {
        setSelectedSongId(event.target.value);
    }

    const togglePlayHandler = () => {
        if (status === MusicPlayerStatus.PLAYING)
            stop();
        else
            play(selectedSongId);
    }

    const content = status && status !== MusicPlayerStatus.UNAVAILABLE && (
        <div className={classes.MusicSelector}>
            <select
                onChange={selectChangeHandler}>
                {options}
            </select>
            <img
                ref={btnRef}
                onClick={togglePlayHandler}
                alt="Play/Stop Song"
                src={PlaySong} />
        </div>
    );


    return content;
}

export default MusicSelector
