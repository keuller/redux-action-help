'use strict';

export const asyncActionMiddleware = store => next => action => {
    if (typeof action === 'function')
        return action(store.dispatch, store.getState());
    else
        return next(action);
};

export const createAction = (name) => {
    return (data) => {
        return { type: name, payload: data };
    };
};
