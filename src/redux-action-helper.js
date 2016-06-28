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
    if (typeof type === 'function') {
      fn = type
      type = 'ACTION'
    }

    return function(data) {
      return function(dispatch, state) {
        var customType = type
        var result = (data == null || data == undefined) ? fn(dispatch) : fn(dispatch, data)
        if (result && !!result.then) {
          return result.then(resp => {
            customType = type + '_SUCCESS'
            return dispatch({ type: customType, payload: resp, error: null })
          }).catch(err => {
            customType = type + '_FAIL'
            return dispatch({ type: customType, payload: null, error: err })
          })
        }
        throw new Error('Async action must return a promise.')
      };
    };
  }

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

  exports.createConstants = _createConstants;
  exports.createAction = _createAction;
  exports.createSimpleAction = _createSimpleAction;
  exports.createDynaAction = _createDynamicAction;
  exports.createAsyncAction = _createAsyncAction;
  exports.asyncActionMiddleware = _asyncActionMiddleware;
}(typeof exports === 'undefined' ? (this.ReduxActionHelper = {}) : exports));
