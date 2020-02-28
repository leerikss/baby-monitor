import React, { useEffect, useRef } from 'react'
import classes from './Microphone.module.css';

import Record from './img/record-icon.png';
import Stop from './img/record-stop-icon.png';
import useMicrophone, { MicrophoneStatus } from '../../../hooks/microphone/useMicrophone';

const Microphone = (props) => {

    const { init, cleanUp, record, stop, status } = useMicrophone(props.serverUrl, props.password);
    const btnRef = useRef(null);

    // Component rendered
    useEffect(() => {
        init();
        return () => {
            cleanUp();
        }
    }, [init, cleanUp]);

    // React on status changes
    useEffect(() => {
        switch (status) {
            // TODO: Hide if UNAVAILABLE
            case MicrophoneStatus.RECORDING:
                btnRef.current.src = Stop;
                break;
            default:
                btnRef.current.src = Record;
                break;
        }

    }, [status]);

    // Handlers
    const toggleRecordHandler = () => {
        if (status === MicrophoneStatus.RECORDING)
            stop();
        else
            record();
    }

    return (
        <img
            ref={btnRef}
            className={classes.Microphone}
            onClick={toggleRecordHandler}
            alt="Record/Stop"
            src={Record} />
    )
}

export default Microphone;
