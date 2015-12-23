Redux Action Helpers
======================

1. Action Creator Helper

This helper create Actions based on ```key``` and standardizes Action's structure. For example:

Instead of create Action like this:
```
const MY_ACTION = 'MY_ACTION';

let myAction = (data) => {
  type: MY_ACTION,
  payload: data
}
```

You just need call ```createAction``` like this:

```
import { createAction } from 'redux-action-helper';

const MY_ACTION = 'MY_ACTION';

let myAction = createAction(MY_ACTION);
```

You must use ```payload``` to get the data passed to action. Inside your reducer function you must access the value like this:

```
let myReducer = (state = {}, action) => {
  switch(action.type) {
    case MY_ACTION:
      return action.payload; // or do something with payload data
    default:
      state;
  }
}
```

2. Async Action Middleware

This helper is the same as thunk middleware. But we decide to put together, because we believe this middleware is related to action helpers. If you prefer to use thunk middleware has the same effect.

The usage:
```
import { asyncActionMiddleware } from 'redux-action-helper';

...your code...

let createStoreWithMiddleware = applyMiddleware(asyncActionMiddleware)(createStore);

export default createStoreWithMiddleware(appReducers);
```
