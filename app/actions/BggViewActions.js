import AppDispatcher from '../dispatcher/AppDispatcher';
import AppConstants from '../constants/AppConstants';

export default {
    getUser(username) {
        AppDispatcher.handleViewAction({
            actionType: AppConstants.Actions.GET_USER,
            username
        });
    }
};