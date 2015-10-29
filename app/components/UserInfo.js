import React from 'react';
import assign from 'object-assign';
import styles from './App.css';


export default React.createClass({
  render() {
    const user = this.props.user;

    return (
      <dl>
        <dt>id</dt>
        <dd>{user.id}</dd>
        <dt>name</dt>
        <dd>{user.name}</dd>
        <dt>year registered</dt>
        <dd>{user.yearregistered.value}</dd>
        <dt>last login</dt>
        <dd>{user.lastlogin.value}</dd>
      </dl>
    );
  }
});