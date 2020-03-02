import React, { useRef } from 'react'

import classes from './LoginForm.module.css';

export const LoginForm = (props) => {

    const passwordInput = useRef(null);
    const turnCheckbox = useRef(false);

    const submitHandler = event => {
        event.preventDefault();
        props.submit(passwordInput.current.value,
            turnCheckbox.current.checked);
    };

    return (
        <form className={classes.LoginForm} onSubmit={submitHandler} >
            <input
                ref={passwordInput}
                type="password"
                autoComplete="on"
                autoFocus />
            <label className={classes.Label}>
                <input
                    ref={turnCheckbox}
                    type="checkbox" />&nbsp;Use TURN Server
                </label>
            <input type="submit" value="Login" />
        </form>
    )
}
