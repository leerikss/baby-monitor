import React, { useRef } from 'react'

import classes from './LoginForm.module.css';

import { useAuthStore, AuthActions } from '../../store/AuthStore';

export const LoginForm = () => {

    const passwordInput = useRef(null);

    const [, dispatch] = useAuthStore();

    const submitHandler = event => {
        event.preventDefault();
        dispatch({
            type: AuthActions.ADD_AUTH_TOKEN,
            authToken: passwordInput.current.value
        })
    };

    return (
        <form className={classes.LoginForm} onSubmit={submitHandler}>
            <input ref={passwordInput} type="password" autoComplete="on" autoFocus />
            <input type="submit" value="Login" />
        </form>
    )
}
