Redux Action Helpers
======================

This lib tries to reduce boilerplate code when you're working with Redux.

### Create Constants Helper

Using Redux action you must set **type** attribute on action. It is commonly used through string constats like: **SAVE = 'SAVE'**. This is boilerplate code and we must reduce it. The ```createConstants``` function solve this problem. We can use this function to create all constants we need to.

```js
import { createConstants } from 'redux-action-helper'

let constants = createConstants(
	'FETCH_CONTACT',
	'FETCH_CONTACT_SUCCESS',
	'FETCH_CONTACT_FAIL'
)
```

The result will be an object that will be used as constant action type:

```js
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

```js
const MY_ACTION = 'MY_ACTION';

let myAction = (data) => {
  type: MY_ACTION,
  payload: data
}
```

You just need call ```createSimpleAction``` like this:

```js
import { createConstants, createSimpleAction } from 'redux-action-helper'

const constants = createConstants('MY_ACTION')

let myAction = createSimpleAction(constants.MY_ACTION)
```

You must use ```payload``` to get the data passed to action. Inside your reducer function you must access the value like this:

```js
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

```js
import axios from 'axios';
import { createAsyncAction } from 'redux-action-helper';
import TodoAction from '../actions/todo';

let fetchTodo = createAsyncAction(FETCH_TODO, () => {
    return axios.get(`${baseUrl}/api/v1/todos`);
})
```

In this example above, we're calling an API to load all todo's item. Notice that we're using ```axios``` lib to request the data from the server. In that example, we aren't pass any extra data to ```axios``` because we're just fetching data.

After performing the asynchronous code, a Promise will processed. The result action type will ***type*** with '\_SUCCESS' suffix if promise resolves or '\_FAIL' otherwise.

To pass some data to invoke a request call, we just need add a second parameter ```createAsyncAction``` like this:

```js
let saveTodo = createAsyncAction(SAVE_TODO, (todo) => {
    axios.post(`${baseUrl}/api/v1/todos`, todo)
})
```

In last example, we're passing a ```todo``` parameter that contains the data to be posted into request. If async action process without error an action of type SAVE_TODO_SUCCESS will be dispatched, otherwise SAVE_TODO_FAIL will be dispatched.

Inside your React component, you can use the action like:

```js
onSaveClick = (e) => {
    e.preventDefault();
    let { store } = this.context;
    store.dispatch(saveTodo({ text:'Learn Redux', completed: false }));
}
```

### Dynamic Action Creator Helper

This helper must be used when you need to do some processing on action and return the payload to be updated on application state. A dynamic action can be created using ```createDynaAction``` method.

```js
import { createDynaAction } from 'redux-action-helper';

let calculateAge = createDynaAction(CALCULATE_AGE, (birthDate) => {
  let ageDifMs = Date.now() - birthDate.getTime();
  let ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
});

let result = calculateAge(new Date(1981, 3, 9));
```

Calling this dynamic action, the output will be:

```js
{
  "type": "CALCULATE_AGE",
  "payload": 34
}
```

### Reducers Helpers

From version 1.1, Redux-action-helper introduces some helpers to eliminate boilerplate code to create **Reducer** functions. There are two helper functions: ```createLeaf``` and ```createReducer```.

First all lets talk about **createLeaf** function. As you know, Redux builds a state data tree through **combineReducers** function. An reducer function is nothing more than a function with signture and a switch..case statement inside of it. Instead of code a huge switch case statement inside your reducer function, we decide to split out into small pieces of code and join them in the end. That is exactly what **createLeaf** function does. Small pieces of code is better to maintain and test.

Let's see some examples:

```js
import { createLeaf } from 'redux-action-helper'
import TodoAction from 'actions/todo'

const getTodos = createLeaf(TodoAction.GET_TODO, (state, action) => {
  return (action.payload != null ? action.payload : []);
})

const addTodo = createLeaf(TodoAction.ADD_TODO, (state, action) => {
  if (!action.payload) return state;
  return [...state, action.payload];
})

```

The sencond function is **createReducer** that will create your reducer itself. This function takes two arguments, first is initial value of reducer and the second is a hash of leaves, created by **createLeaf** function. See the code below:

```js
import { createReducer } from 'redux-action-helper'

const todos = createReducer([], { 
  addTodo, getTodos, toggleTodo, removeTodo 
})
```

In the code above we create a reducer function and assign it to **todos** variable. This is a default reducer function and now you can use **combineReducers** to create your application store.

A plus to use **createReducer** function is in the case of your code inside of leaf throws any error, this will be catched and handled by helper, returning your previous state. It is good in production mode which turns your application more reliable.

### Async Action Middleware

This middleware is the same as thunk middleware. But we decide to put it all together, because we believe this middleware is related to action helpers. If you prefer to use thunk middleware has the same effect.

The usage:

```js
import { combineReducers, createStore, applyMiddleware } from 'redux'
import { asyncActionMiddleware } from 'redux-action-helper'
import rootReducer from '../reducers'

let createStoreWithMiddleware = applyMiddleware(asyncActionMiddleware)(createStore);

export default createStoreWithMiddleware(rootReducer)
```

The redux-action-helper project was inspired in real project code, so we decided to share with community, because we use much open source code.

Any suggestion ? Feel free to contribute and help us to create a set of helpers.
