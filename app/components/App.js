import React from 'react';
import BggStore from '../stores/BggStore';
import BggActions from '../actions/BggViewActions';

import styles from './App.css';


function getClicks() {
    return {
        clicks: BggStore.getClicks()
    };
}

export default React.createClass({
    getInitialState() {
        return getClicks();
    },

    componentWillMount() {
        BggStore.addChangeListener(this._onChange);
    },

    componentWillUnmount() {
        BggStore.removeChangeListener(this._onChange);
    },

    _onChange() {
        this.setState(getClicks());
    },

    render() {
        return <h1 className={this.state.clicks % 2 === 1 ? styles.app : styles.bap} onClick={this.handleClick}>Jo, clicked {this.state.clicks} times</h1>;
    },

    handleClick(event) {
        BggActions.increaseClick();
    },
});
