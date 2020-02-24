import React from 'react';
import './App.css';
import { LoginForm } from './components/LoginForm/LoginForm';
import { useAuthStore } from './store/AuthStore';
import VideoStream from './components/VideoStream/VideoStream';

function App() {

    const [{ authToken }] = useAuthStore();

    const content = (authToken === null) ?
        <VideoStream /> :
        <VideoStream/>;
    
    return (
        <div className="App">
            {content}
        </div>
    );
}

export default App;
