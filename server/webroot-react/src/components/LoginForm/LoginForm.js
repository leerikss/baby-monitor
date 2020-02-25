import React, { useRef } from 'react'

import classes from './LoginForm.module.css';

export const LoginForm = (props) => {

    const passwordInput = useRef(null);

    const submitHandler = event => {
        event.preventDefault();
        props.submit( passwordInput.current.value );
    };

    return (
        <form className={classes.LoginForm} onSubmit={submitHandler} >
            <input
                ref={passwordInput}
                type="password"
                autoComplete="on"
                autoFocus />
            <input type="submit" value="Login" />
        </form>
    )
}
