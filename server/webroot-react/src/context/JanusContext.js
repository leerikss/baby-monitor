import React, { useReducer, createContext } from "react";

const JanusContext = createContext();

const JanusContextActions = {
    SET_STREAMS: 'SET_STREAMS',
    SET_SELECTED_STREAM_ID: 'SET_SELECTED_STREAM_ID'
}

const initialState = {
    streams: [],
    activeStreamId: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case JanusContextActions.SET_STREAMS:
            return {
                ...state,
                streams: [...action.streams]
            };
        case JanusContextActions.SET_SELECTED_STREAM_ID:
            return { ...state, activeStreamId: action.streamId }
        
        default:
            return state;
    }
}

const JanusContextProvider = (props) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const value = { state, dispatch }

    return (
        <JanusContext.Provider value={value}>
            {props.children}
        </JanusContext.Provider>
    );
}

export { JanusContext, JanusContextProvider, JanusContextActions }