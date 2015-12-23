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

2. Async Actin Middleware
