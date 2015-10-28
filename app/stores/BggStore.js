import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';
import assign from 'object-assign';


const CHANGE_EVENT = 'change';
let _clicks = 0;

function increaseClick(increment) {
    _clicks += increment;
}

const BggStore = assign({}, EventEmitter.prototype, {
    getClicks() {
        return _clicks;
    },

    dispatcherToken: AppDispatcher.register(payload => {
        console.log(payload);
        var action = payload.action;

        switch (action.actionType) {
            case AppConstants.Actions.INCREASE_CLICK:
                increaseClick(action.increment);
                BggStore.emitChange();
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