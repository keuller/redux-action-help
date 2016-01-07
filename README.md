Redux Action Helpers
======================

### Action Creator Helper

This helper create Actions based on ```key``` and standardizes Action's structure. For example:

Instead of create Action like this:
```
const MY_ACTION = 'MY_ACTION';

let myAction = (data) => {
  type: MY_ACTION,
  payload: data
}
```

You just need call ```createSimpleAction``` like this:

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

There are two types of actions: ```Default``` and ```Simple``` action. The main difference between them are the ```error```attribute that there is in ```Default``` action. This attribute can be used to pass some error information about the action, commonly used in async actions.

You can create a simple action using ```createSimpleAction``` instead of ```createAction```.

### Async Action Creator Helper

Similarly to ```createAction``` and ```createSimpleAction``` helpers, there is a helper for asynchronous action. You can use an async action to call a Rest API, for example. So to create an async action, you can do that like:

```
import axios from 'axios';
import { createAsyncAction } from '../redux-action-helper';
import TodoAction from '../actions/todo';

let fetchTodo = createAsyncAction(dispatch => {
    axios.get(`${baseUrl}/api/v1/todos`).then((response) => {
      return dispatch(TodoAction.loadTodos( response.data ));
    });
});
```

In this example above, we're calling an API to load all todo's item. Notice that we're using ```axios``` lib to request the data from the server. In that example, we aren't pass any extra data to ```axios``` because we're just fetching data.

To pass some data to invoke a request call, we just need add a second parameter ```createAsyncAction``` like:

```
let saveTodo = createAsyncAction((dispatch, todo) => {
    axios.post(`${baseUrl}/api/v1/todos`, todo).then(response => {
      if (response.data.id) {
        return dispatch(TodoAction.addTodo(response.data));
      }
      return dispatch(TodoAction.addTodo(null, { error: 'An error has occurred in the operation.' }))
    });
});
```

In that example, we're passing a ```todo``` parameter with contains the data to be posted into request.

Inside your React component, you can use the action like:

```
onSaveClick = (e) => {
    e.preventDefault();
    let { store } = this.context;
    store.dispatch(saveTodo({ text:'Learn Redux', completed: false }));
}
```

### Async Action Middleware

This helper is the same as thunk middleware. But we decide to put it all together, because we believe this middleware is related to action helpers. If you prefer to use thunk middleware has the same effect.

The usage:
```
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { asyncActionMiddleware } from 'redux-action-helper';

...your code...

let createStoreWithMiddleware = applyMiddleware(asyncActionMiddleware)(createStore);

export default createStoreWithMiddleware(appReducers);
```

The redux-action-helper project was inspired in real project code, so we decided to share with community, because we use much open source code.

Any suggestion ? Feel free to contribute and help us to create a set of helpers.
