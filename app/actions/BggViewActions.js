import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

export default {
    increaseClick(increment = 1) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.Actions.INCREASE_CLICK,
            increment
        });
    }
};