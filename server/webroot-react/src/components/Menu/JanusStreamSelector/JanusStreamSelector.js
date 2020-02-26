import React, { useEffect, useState, useContext } from 'react'
import classes from './JanusStreamSelector.module.css'
import { JanusContext, JanusContextActions } from '../../../context/JanusContext';

const JanusStreamSelector = () => {

    const { state, dispatch } = useContext(JanusContext);
    const [options, setOptions] = useState(null);

    useEffect(() => {
        setOptions(state.streams.map((stream) => {
            return (<option key={stream.id} value={stream.id}>{stream.description}</option>);
        }));

    }, [state.streams])

    const selectChangeHandler = (event) => {
        dispatch({
            type: JanusContextActions.SET_SELECTED_STREAM_ID,
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
