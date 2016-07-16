;(function (exports) {
	'use strict';

	function _createConstants() {
    var consts = {}, total = 0, key = ''
    if (arguments == null || arguments == undefined) return consts
    total = arguments.length
    for(var idx=0; idx < total; idx++) {
      key = arguments[idx].toUpperCase()
      consts[key] = arguments[idx]
    }
    return consts
  }


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

	function _createDynamicAction(name, fn) {
		return function(data) {
			let _payload;
			if (data)
				_payload = fn(data);
			else
				_payload = fn();
			return { type: name, payload: _payload, error: null };
		};
	}

	function _createAsyncAction(type, fn) {
		return function(data) {
			return function(dispatch, state) {
				if (typeof type === 'function') {
					fn = type
					type = 'ACTION'
				}

				// backward compatibility
				if (type == 'ACTION') {
					if (data == null || data == undefined) return fn(dispatch)
					return fn(dispatch, data)
				}

				var customType = type
				var result = (data == null || data == undefined) ? fn(dispatch) : fn(dispatch, data)
				if (result && !!result.then) {
					result.then(function(resp) {
						customType = type + '_SUCCESS'
						dispatch({ type: customType, payload: resp, error: null })
					}).catch(function(err) {
						customType = type + '_FAIL'
						dispatch({ type: customType, payload: null, error: err })
					})
				}
			};
		};
	}

	function _createLeaf(type, fn) {
		return {
			type: type,
			execute: function(state, action) {
				if (type == action.type) {
					return fn.call(null, state, action)
				}
				return state
			}
		}
	}

	function _createReducer(init, obj) {
		if (obj == null || obj == undefined) {
			throw new Error('The first argument of \'createReducer\' function is required. It is the reducer initial value.')
		}

		function Manager(reducerObj) {
			this.previous = null;
			this.leaves = [];
			for(var key in reducerObj) {
				this.leaves.push(reducerObj[key])
			}
			this.leafCount = Object.keys(reducerObj).length;
		}

		Manager.prototype = {
			execute: function(type, state, action) {
				var next = null;
				this.previous = state;
				try {
					for(var idx=0; idx < this.leafCount; idx++) {
						if (this.leaves[idx].type !== action.type) continue;
						next = this.leaves[idx].execute(state, action);
					}
					this.previous = null;
					return (next == null || next == undefined) ? state : next;
				} catch (err) {
					console.log(err)
					return this.previous
				}
			}
		}

		return function(state, action) {
			var manager$ = new Manager(obj);
			var hasState = (state != null && state != undefined)
			return manager$.execute(action.type, (hasState ? state : init), action)
		}
	}

	// the same as redux-thunk middleware
	function _asyncActionMiddleware(store) {
		return function (next) {
			return function(action) {
				if (typeof action === 'function') {
					return action(store.dispatch, store.getState());
				}
				return next(action);
			};
		};
	}

	exports.createLeaf = _createLeaf;
	exports.createReducer = _createReducer;
	exports.createConstants = _createConstants;
	exports.createAction = _createAction;
	exports.createSimpleAction = _createSimpleAction;
	exports.createDynaAction = _createDynamicAction;
	exports.createAsyncAction = _createAsyncAction;
	exports.asyncActionMiddleware = _asyncActionMiddleware;
}(typeof exports === 'undefined' ? (this.ReduxActionHelper = {}) : exports));
