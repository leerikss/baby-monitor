import React, { useState, useContext } from 'react';
import './App.css';
import { LoginForm } from './components/LoginForm/LoginForm';
import VideoStream from './components/VideoStream/VideoStream';
import { AppContext } from './context/AppContext';
import Animator from './components/UI/Animator/Animator';
import Menu from './components/Menu/Menu';
import Helmet from 'react-helmet';

function App() {

    const [password, setPassword] = useState(null);
    const [ state ] = useContext(AppContext);

    const submitHandler = (pass) => {
        setPassword(pass);
    }

    const showLoginForm = (password === null);

    return (
        <div className="App">

            <Helmet>
                <title>Baby Monitor</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
            </Helmet>
            
            <Animator show={showLoginForm}>
                <LoginForm submit={submitHandler} />
            </Animator>

            <Animator show={!showLoginForm}>
                <VideoStream
                    password={password}
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
