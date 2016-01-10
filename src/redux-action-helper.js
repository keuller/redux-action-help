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

	function _createDynamicAction(type, fn) {
		return function(data) {
			if (data)
				return { type, payload: fn(data), error: null };
			else
				return { type, payload: fn(), error: null };
		};
	}

	function _asyncActionMiddleware(store) {
		return function (next) {
			return function(action) {
				if (typeof action === 'function')
					return action(store.dispatch, store.getState());
				else {
					try {
						action.payload.then(result => {
							return next({ type: action.type, payload: result, error: null });
						}).catch(err => {
							return next({ type: action.type, payload: null, error: err });
						});
					}	catch (e) {
						return next(action);
					}
				}
			};
		};
	}

	exports.createAction = _createAction;
	exports.createSimpleAction = _createSimpleAction;
	exports.createDynaAction = _createDynamicAction;
	exports.createAsyncAction = _createAsyncAction;
	exports.asyncActionMiddleware = _asyncActionMiddleware;
}(typeof exports === 'undefined' ? (this.ReduxActionHelper = {}) : exports));
