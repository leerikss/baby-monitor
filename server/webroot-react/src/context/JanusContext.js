import React, { useReducer, createContext } from "react";

const JanusContext = createContext();

const JanusContextActions = {
    ZOOM_VIDEO: 'ZOOM_VIDEO',
    MUTE_VIDEO: 'MUTE_VIDEO',
    UNMUTE_VIDEO: 'UNMUTE_VIDEO',
    PAUSE_VIDEO: 'PAUSE_VIDEO',
    VIDEO_PAUSED: 'VIDEO_PAUSED',
    PLAY_VIDEO: 'PLAY_VIDEO',
    VIDEO_PLAYING: 'VIDEO_PLAYING',
    NEW_STREAM: 'NEW_STREAM',
    RESET_STREAMS: 'RESET_STREAMS'
}

const JanusVideoStates = {
    PAUSE: 'PAUSE',
    PAUSED: 'PAUSED',
    PLAY: 'PLAY',
    PLAYING: 'PLAYING'
}

const initialState = {
    janusStreams: [],
    videoState: JanusVideoStates.PAUSED,
    videoMuted: false,
    videoHeight: 100
};

const reducer = (state, action) => {
    switch (action.type) {
        case JanusContextActions.ZOOM_VIDEO:
            return { ...state, videoHeight: state.videoHeight + action.zoom }

        case JanusContextActions.MUTE_VIDEO:
            return { ...state, videoMuted: true };
        case JanusContextActions.UNMUTE_VIDEO:
            return { ...state, videoMuted: false };

        case JanusContextActions.PAUSE_VIDEO:
            return { ...state, videoState: JanusVideoStates.PAUSE };
        case JanusContextActions.VIDEO_PAUSED:
            return { ...state, videoState: JanusVideoStates.PAUSED };
        case JanusContextActions.PLAY_VIDEO:
            return { ...state, videoState: JanusVideoStates.PLAY };
        case JanusContextActions.VIDEO_PLAYING:
            return { ...state, videoState: JanusVideoStates.PLAYING };

        case JanusContextActions.NEW_STREAM:
            return {
                ...state,
                janusStreams:
                    [...state.janusStreams].push(action.janusStream)
            };
        case JanusContextActions.RESET_STREAMS:
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

export { JanusContext, JanusContextProvider, JanusContextActions, JanusVideoStates }