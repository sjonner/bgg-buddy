import assign from 'object-assign';
import { Dispatcher } from 'flux';
import AppConstants from '../constants/AppConstants';

const AppDispatcher = assign(new Dispatcher(), {
    handleViewAction(action) {
        var payload = {
            source: AppConstants.Dispatcher.VIEW_ACTION,
            action
        };
        this.dispatch(payload);
    },
    handleServerAction(action) {
        var payload = {
            source: AppConstants.Dispatcher.SERVER_ACTION,
            action
        };
        this.dispatch(payload);
    }
});

export default AppDispatcher;