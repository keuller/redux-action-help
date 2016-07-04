# API Reference

- [Helpers](#helpers)
  - [`createAction`](#createAction)
  - [`createAsyncAction`](#createAsyncAction)
  - [`createConstants`](#createConstants)
  - [`createDynaAction`](#createDynaAction)
  - [`createLeaf`](#createLeaf)
  - [`createReducer`](#createReducer)
  - [`createSimpleAction`](#createSimpleAction)

## Helpers

#### `createAction(type)`
This function creates an action creator that yields an action with a specific type, passed by argument. The action produced by this action creator has that struture:

```js
{
	"type": type,
	"payload": (null or argument passed by),
	"error": (null or argument passed by)
}
```

After your creates it, we can invoke the action creator passing two arguments: the data assigned to ```payload``` and some object that will be assigned to ```error```.

Let's see a snippet code that demonstrates the usage of function:

```js
// creates an action creator to add contact
let addContact = createAction(ADD_CONTACT)

// dispatching an action using action creator
store.dispatch(addContact(entity))
```

#### `createAsyncAction(type, fn)`
This function creates an action creator that yields asynchronous action. This function takes two arguments: action type and a function that must return a Promise object to be evaluated.

```js
import axios from 'axios'

let saveTodo = createAsyncAction(TodoAction.ADD_TODO, (todo) => {
  return axios.post(`${baseUrl}/api/v1/todos`, todo)
})
```

After the Promise execution the results could be: **resolved** or **rejected**. If Promises is resolved an action will be dispatched with ```type``` +  ```_SUCCESS``` suffix otherwise will be dispatched ```_FAIL``` suffix.

In our last code example, after the action **saveTodo** is performed we could get two action types dispatched: **ADD\_TODO\_SUCCESS** or **ADD\_TODO\_FAIL**. Its enforces a good practice to handle asynchronous action.

#### `createConstants(...args)`
This function creates an object that will be used as constants **action types**. This functions takes as list of strings as argument which will be used to generate the object.

```js
import { createConstants } from 'redux-action-helper'

let constants = createConstants('GET_TODO', 'ADD_TODO', 'TOGGLE_TODO')
```

The constant object created by the last snippet code looks like:

```js
let constants = {
  GET_TODO: 'GET_TODO',
  ADD_TODO: 'ADD_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO'
}
```

#### `createDynaAction(type, fn)`
TODO

#### `createLeaf(type, fn)`
TODO

#### `createReducer(initialValue, object)`
TODO

#### `createSimpleAction(type)`
TODO