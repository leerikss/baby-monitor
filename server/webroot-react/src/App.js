import React, { useState, useContext, useEffect } from 'react';
import './App.css';
import { LoginForm } from './components/LoginForm/LoginForm';
import VideoStream from './components/VideoStream/VideoStream';
import { AppContext, AppContextActions } from './context/AppContext';
import Animator from './components/UI/Animator/Animator';
import Menu from './components/Menu/Menu';

function App() {

    const [password, setPassword] = useState(null);
    const [useTurn, setUseTurn] = useState(null);
    const [ state,uiDispatch ] = useContext(AppContext);

    const submitHandler = (pass, useTurn) => {
        setPassword(pass);
        setUseTurn(useTurn);
    }

    const showLoginForm = (password === null);

    const mouseDownHandler = () => {
        uiDispatch({ type: AppContextActions.MOUSE_DOWN });
    }

    const mouseUpHandler = () => {
        uiDispatch({ type: AppContextActions.MOUSE_UP });
    }

    useEffect(() => {
        document.addEventListener("mousedown", mouseDownHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        return () => {
          document.removeEventListener("mousedown", mouseDownHandler);
          document.removeEventListener("mouseup", mouseUpHandler);
        };
    });
    
    return (
        <div className="App">

            <Animator show={showLoginForm}>
                <LoginForm submit={submitHandler} />
            </Animator>

            <Animator show={!showLoginForm}>
                <VideoStream
                    password={password}
                    useTurn={useTurn}
                    janusUrl={process.env.REACT_APP_JANUS_SERVER_URL}
                    turnUrl={process.env.REACT_APP_TURN_SERVER_URL} />
            </Animator>

            <Animator show={state.menuOpen}>
                <Menu password={password} />
            </Animator>

        </div>
    );
}

export default App;
