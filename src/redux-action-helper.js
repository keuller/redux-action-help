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

	function _createDynamicAction(name, fn) {
		return function(data) {
			var _payload = null;
			if (data) {
				_payload = fn(data);
			} else {
				_payload = fn();
			}
			return { type: name, payload: _payload };
		};
	}

	function _asyncActionMiddleware(store) {
		return function (next) {
			return function(action) {
				if (typeof action === 'function')
					return action(store.dispatch, store.getState());
				else {
					try {
						action.payload.then(function(result) {
							return next({ type: action.type, payload: result, error: null });
						}).catch(function(err) {
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
