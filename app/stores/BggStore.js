import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import assign from 'object-assign';
import request from 'superagent';

const CHANGE_EVENT = 'change';

let _user = null;

function setUser(username) {
  request.get('/api/user?name=' + username).end((err, res) => {
    if (err || !res.body || !res.body.user) {
      _user = null;
    } else {
      _user = res.body.user;
    }
    BggStore.emitChange();
  });
}

const BggStore = assign({}, EventEmitter.prototype, {
  getCurrentUser() {
    return _user;
  },

  dispatcherToken: AppDispatcher.register(payload => {
    console.log(payload);
    var action = payload.action;

    switch (action.actionType) {
      case AppConstants.Actions.GET_USER:
        setUser(action.username);
        break;
    }

    // Return true for the promise.
    return true;
  }),

  emitChange() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener(cb) {
    this.on(CHANGE_EVENT, cb);
  },

  removeChangeListener(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});

export default BggStore;