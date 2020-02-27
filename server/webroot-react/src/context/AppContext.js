import React, { useReducer, createContext } from "react";

const AppContext = createContext();

const AppContextActions = {
    OPEN_MENU: 'OPEN_MENU',
    CLOSE_MENU: 'CLOSE_MENU',
    ZOOM_VIDEO: 'ZOOM_VIDEO',
    MUTE_VIDEO: 'MUTE_VIDEO',
    UNMUTE_VIDEO: 'UNMUTE_VIDEO',
    PAUSE_VIDEO: 'PAUSE_VIDEO',
    VIDEO_PAUSED: 'VIDEO_PAUSED',
    PLAY_VIDEO: 'PLAY_VIDEO',
    VIDEO_PLAYING: 'VIDEO_PLAYING',
}

const VideoStates = {
    PAUSE: 'PAUSE',
    PAUSED: 'PAUSED',
    PLAY: 'PLAY',
    PLAYING: 'PLAYING'
}

const initialState = {
    videoState: VideoStates.PAUSED,
    videoMuted: false,
    videoHeight: 100,
    menuOpen: false
};

const reducer = (state, action) => {
    switch (action.type) {

        case AppContextActions.OPEN_MENU:
            return { ...state, menuOpen: true }
        case AppContextActions.CLOSE_MENU:
                return { ...state, menuOpen: false}

        case AppContextActions.ZOOM_VIDEO:
            return { ...state, videoHeight: state.videoHeight + action.zoom }

        case AppContextActions.MUTE_VIDEO:
            return { ...state, videoMuted: true };
        case AppContextActions.UNMUTE_VIDEO:
            return { ...state, videoMuted: false };

        case AppContextActions.PAUSE_VIDEO:
            return { ...state, videoState: VideoStates.PAUSE };
        case AppContextActions.VIDEO_PAUSED:
            return { ...state, videoState: VideoStates.PAUSED };
        case AppContextActions.PLAY_VIDEO:
            return { ...state, videoState: VideoStates.PLAY };
        case AppContextActions.VIDEO_PLAYING:
            return { ...state, videoState: VideoStates.PLAYING };

        default:
            return state;
    }
}

const AppContextProvider = (props) => {

    const [state, dispatch] = useReducer(reducer, initialState);
    const value = [ state, dispatch ]

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
}

export { AppContext, AppContextProvider, AppContextActions, VideoStates }