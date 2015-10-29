import React from 'react';
import BggStore from '../stores/BggStore';
import UserForm from '../components/UserForm';
import UserInfo from '../components/UserInfo';

import styles from './App.css';


function getCurrentUser() {
  return { user: BggStore.getCurrentUser() };
}

export default React.createClass({
  getInitialState() {
    return getCurrentUser();
  },

  componentWillMount() {
  // ComponentDidMount() {
    BggStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    BggStore.removeChangeListener(this._onChange);
  },

  _onChange() {
    this.setState(getCurrentUser());
  },

  render() {
    const user = this.state ? this.state.user : null;
    const userInfo = user ? <UserInfo user={user} /> : null;

    return (
      <div>
        <UserForm user={user} />
        {userInfo}
      </div>
    );
  }
});
