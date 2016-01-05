;(function (exports) {
	'use strict';

	function _createSimpleAction(name) {
		return function(data) {
			return { type: name, payload: data };
		};
	}

	function _createAction(name) {
		return function(data, err) {
			return { type: name, payload: data, error: err };
		};
	}

	function _createAsyncAction(fn) {
		return function(data) {
			return function(dispatch) {
				if (data == null || data == undefined)
					return fn(dispatch);
				else
					return fn(dispatch, data);
			};
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
	exports.createSimpleAction = _createSimpleAction;
	exports.createAsyncAction = _createAsyncAction;
	exports.asyncActionMiddleware = _asyncActionMiddleware;
}(typeof exports === 'undefined' ? (this.ReduxActionHelper = {}) : exports));
