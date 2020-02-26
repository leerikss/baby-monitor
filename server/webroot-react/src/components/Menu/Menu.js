import React, { useContext } from 'react'

import { AppContext } from '../../context/AppContext';
import Animator from '../UI/Animator/Animator'

import classes from './Menu.module.css';
import JanusStreamSelector from './JanusStreamSelector/JanusStreamSelector';

const Menu = (props) => {

    const { state } = useContext(AppContext);

    return (
        <Animator show={state.menuOpen}>
            <div className={classes.Menu}>
                <JanusStreamSelector />
            </div>
        </Animator>
    );
}

export default Menu;