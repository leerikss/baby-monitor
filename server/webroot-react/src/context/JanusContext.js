import React, { useReducer, createContext } from "react";

const initialState = {
    janusStreams: [],
    janusState: null,
    videoPaused: true,
    videoMuted: false,
    videoHeight: 100
};

const JanusContext = createContext();

const reducer = (state, action) => {
    switch (action.type) {
        case 'ZOOM_VIDEO':
            return {...state, videoHeight: state.videoHeight + action.zoom }
        case 'MUTE_VIDEO':
            return { ...state, videoMuted: true };
        case 'UNMUTE_VIDEO':
            return { ...state, videoMuted: false };
        case 'PAUSE_VIDEO':
            return { ...state, videoPaused: true };
        case 'PLAY_VIDEO':
            return { ...state, videoPaused: false };
        case 'SET_JANUS_STATE':
            return { ...state, janusState: action.janusState };
        case 'NEW_STREAM':
            return {
                ...state,
                janusStreams: 
                [...state.janusStreams].push(action.janusStream) };
        case 'RESET_STREAMS':
            return { ...state, janusStreams: [] };
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

export { JanusContext, JanusContextProvider }