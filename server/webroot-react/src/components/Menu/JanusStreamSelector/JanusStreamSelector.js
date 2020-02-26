import React, { useEffect, useState, useContext } from 'react'
import classes from './JanusStreamSelector.module.css'
import { AppContext, AppContextActions } from '../../../context/AppContext';

const JanusStreamSelector = () => {

    const { state, dispatch } = useContext(AppContext);
    const [options, setOptions] = useState(null);

    useEffect(() => {
        setOptions(state.janusStreams.map((stream) => {
            return (<option key={stream.id} value={stream.id}>{stream.description}</option>);
        }));

    }, [state.janusStreams])


    const selectChangeHandler = (event) => {
        dispatch({
            type: AppContextActions.SET_SELECTED_JANUS_STREAM,
            streamId: event.target.value
        })
    }

    return (
        <select onChange={selectChangeHandler} className={classes.JanusStreamSelector}>
            {options}
        </select>
    )
}

export default JanusStreamSelector
