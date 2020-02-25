import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';
import './Animator.css';

const DURATION = 1000;

const Animator = (props) => {
    return (
        <CSSTransition
            in={props.show}
            mountOnEnter
            unmountOnExit
            timeout={DURATION}
            classNames="fade-slide">
            {props.children}
        </CSSTransition>
    );
}

export default Animator;