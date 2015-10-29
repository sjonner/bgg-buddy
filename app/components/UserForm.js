import React from 'react';
import BggActions from '../actions/BggViewActions';

import styles from './App.css';


export default React.createClass({
  render() {
    return (
      <form onSubmit={this.checkInput}>
        <h1 className={this.props.user ? styles.app : styles.bap}>Find BGG Geek:</h1>
        <input name="username" ref="username" />
        <button type="submit" name="search">go</button>
      </form>
    );
  },

  checkInput(event) {
    event.preventDefault();
    const username = (this.refs.username.value || '').trim();
    if (username) {
      BggActions.getUser(username);
    }
  },
});