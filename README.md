Redux Action Helpers
======================

### Create Constants Helper

Using Redux action you must set **type** attribute on action. It is commonly used through string constats like: **SAVE = 'SAVE'**. This is boilerplate code and we must reduce it. The ```createConstants``` function solve that problem. We can use this function to create all constants we need to.

```
import { createConstants } from 'redux-action-helper'

let constants = createConstants(
	'FETCH_CONTACT',
	'FETCH_CONTACT_SUCCESS',
	'FETCH_CONTACT_FAIL'
)
```

The result will be an object that will be used as constant action type:

```
function reducer(state = {}, action) {
	switch(action.type) {
		case constants.FETCH_CONTACT: return a;
		case constants.FETCH_CONTACT.SUCCESS: return b;
		case constants.FETCH_CONTACT_FAIL: return c;
		default: return state;
	}
}
```

Simple and straightforward. Pretty nifty!

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
import { createConstants, createSimpleAction } from 'redux-action-helper';

const constants = createConstants('MY_ACTION');

let myAction = createSimpleAction(constants.MY_ACTION);
```

You must use ```payload``` to get the data passed to action. Inside your reducer function you must access the value like this:

```
let myReducer = (state = {}, action) => {
  switch(action.type) {
    case constants.MY_ACTION:
      return action.payload; // or do something with payload data
    default:
      state;
  }
}
```

There are two types of actions: ```Default``` and ```Simple``` action. The main difference between them are the ```error```attribute that there is in ```Default``` action. This attribute can be used to pass some error information about the action, commonly used in async actions or dynamic actions.

You can create a **default** action using ```createAction``` instead of ```createSimpleAction```.

### Async Action Creator Helper

Similarly to ```createAction``` and ```createSimpleAction``` helpers, there is a helper for asynchronous action. You can use this helper to call a Rest API or todo some processing that returns a Promise, for example. So to create an async action, you can do that like:

```
import axios from 'axios';
import { createAsyncAction } from 'redux-action-helper';
import TodoAction from '../actions/todo';

let fetchTodo = createAsyncAction(FETCH_TODO, dispatch => {
    return axios.get(`${baseUrl}/api/v1/todos`);
});
```

In this example above, we're calling an API to load all todo's item. Notice that we're using ```axios``` lib to request the data from the server. In that example, we aren't pass any extra data to ```axios``` because we're just fetching data.

After performing the asynchronous code, a Promise will processed. The result action type will ***type*** with '\_SUCCESS' if promise resolves or '\_FAIL' otherwise.

To pass some data to invoke a request call, we just need add a second parameter ```createAsyncAction``` like:

```
let saveTodo = createAsyncAction(SAVE_TODO, (dispatch, todo) => {
    axios.post(`${baseUrl}/api/v1/todos`, todo);
});
```

In last example, we're passing a ```todo``` parameter that contains the data to be posted into request. If async action process without error an action of type SAVE_TODO_SUCCESS will be dispatched, otherwise SAVE_TODO_FAIL will be dispatched.

Inside your React component, you can use the action like:

```
onSaveClick = (e) => {
    e.preventDefault();
    let { store } = this.context;
    store.dispatch(saveTodo({ text:'Learn Redux', completed: false }));
}
```

### Dynamic Action Creator Helper

This helper must be used when you need to do some processing on action and return the payload to be updated on application state. A dynamic action can be created using ```createDynaAction``` method.

```
import { createDynaAction } from 'redux-action-helper';

let calculateAge = createDynaAction(CALCULATE_AGE, (birthDate) => {
  let ageDifMs = Date.now() - birthDate.getTime();
  let ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

let result = calculateAge(new Date(1981, 3, 9));
```

Calling this dynamic action, the output will be:

```
{
  "type": "CALCULATE_AGE",
  "payload": 34
}
```

You can return a promise as result, that will be processed like an async action. Let's checkout other example that uses a promise as a result object. Let's rewrite our previous **saveTodo** action using dynamic action helper.

```
import { createDynaAction } from 'redux-action-helper';

let saveTodo = createDynaAction(TodoAction.ADD_TODO, (todo) => {
  return axios.post(`${baseUrl}/api/v1/todos`, todo);
});
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
