import React, { useReducer, createContext } from "react";

const JanusContext = createContext();

const JanusContextActions = {
    SET_STREAMS: 'SET_STREAMS',
    SET_CURRENT_STREAM_ID: 'SET_CURRENT_STREAM_ID'
}

const initialState = {
    streams: [],
    currentStreamId: null
};

const reducer = (state, action) => {
    switch (action.type) {
        case JanusContextActions.SET_STREAMS:
            return {
                ...state,
                streams: [...action.streams]
            };
        case JanusContextActions.SET_CURRENT_STREAM_ID:
            return { ...state, currentStreamId: action.streamId }
        
        default:
            return state;
    }
}

const JanusContextProvider = (props) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const value = [ state, dispatch ]

    return (
        <JanusContext.Provider value={value}>
            {props.children}
        </JanusContext.Provider>
    );
}

export { JanusContext, JanusContextProvider, JanusContextActions }