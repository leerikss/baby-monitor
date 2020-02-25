import React, { useState } from 'react';
import './App.css';
import { LoginForm } from './components/LoginForm/LoginForm';
import VideoStream from './components/VideoStream/VideoStream';
import { JanusContextProvider } from './context/JanusContext';

function App() {

    const [password, setPassword] = useState(null);

    const submitHandler = (pass) => {
        setPassword(pass);
    }

    const content = (password === null) ?
        <LoginForm submit={submitHandler} /> :
        <JanusContextProvider>
            <VideoStream
                pin={password}
                serverUrl={process.env.REACT_APP_JANUS_SERVER_URL} />
            
        </JanusContextProvider>

    return (
        <div className="App">
            {content}
        </div>
    );
}

export default App;
