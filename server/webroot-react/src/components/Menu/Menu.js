import React, { useContext } from 'react'

import { AppContext } from '../../context/AppContext';
import Animator from '../UI/Animator/Animator'


import classes from './Menu.module.css';

const Menu = (props) => {

    const { state } = useContext(AppContext);

    return (
        <Animator show={state.menuOpen}>
            <div className={classes.Menu}>Menu</div>
        </Animator>
    );
}

export default Menu;