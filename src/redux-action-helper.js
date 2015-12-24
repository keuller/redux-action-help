;(function (exports) {
	'use strict';

	function _createAction(name) {
		return function(data) {
			return { type: name, payload: data };
		};
	}

	function _asyncActionMiddleware(store) {
		return function (next) {
			return function(action) {
			    if (typeof action === 'function')
			        return action(store.dispatch, store.getState());
			    else
			        return next(action);
			}
		}
	}

	exports.createAction = _createAction;
	exports.asyncActionMiddleware = _asyncActionMiddleware;
}(typeof exports === 'undefined' ? (this.ReduxActionHelper = {}) : exports));
