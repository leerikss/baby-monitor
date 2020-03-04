import React from 'react'
import { AppContextActions, AppContext } from '../context/AppContext';
import { useContext } from 'react';

const withMouseEvents = Component => props => {

    const [, uiDispatch] = useContext(AppContext);

    const mouseDownHandler = () => {
        uiDispatch({ type: AppContextActions.MOUSE_DOWN });
    }

    const mouseUpHandler = () => {
        uiDispatch({ type: AppContextActions.MOUSE_UP });
    }

    return (
        <span
            onMouseDown={mouseDownHandler}
            onTouchStart={mouseDownHandler}
            onMouseUp={mouseUpHandler}
            onTouchEnd={mouseUpHandler}>
            <Component {...props}/>
        </span>
    );
};

export default withMouseEvents
