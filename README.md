# redux-saga-promises

## Why?
##### It helps in transforming redux-saga requests in promises which can be awaited till the saga generator function has not yet resolved, due to which we dont have to pass callback function to the actionCreators. As well as it resolves the  problem of maintaing `ACTION_TYPE_SUCCESS` or `ACTION_TYPE_FAILED`  .

## Installation
`npm i redux-saga-promises`

`yarn add redux-saga-promises`

#### Usage

# 1.Defining Store
```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import {configureWatchers} from 'redux-saga-promises'
import createSagaMiddleware from 'redux-saga';

 const sagaMiddleware = createSagaMiddleware();
 const store = createStore(rootreducer, applyMiddleware(sagaMiddleware) );
 
 configureWatchers({
     store,   //  required
     successActionType: null,
     failedActionType: null,
 })
 
 export default store;
 
```


### configureWatchers (function)
##### accpets a single parameter "options" of type object.

##

| Options | description  | required  |
| :---:   | :-: | :-: |
| store | redux store | true |
| successActionType | an redux action which will be called after every saga generator is resolved successfully, eg. `{type: 'ALERT_ACTIVATE', message: 'action completed'}` | false |
| failedActionType | an redux action which will be called after every saga generator rejects with an error, eg. `{type: 'ALERT_ACTIVATE', message: 'Oops !! something went wrong'}` | false |


# 2.Creating saga watchers


```javascript
import {createWatchers} from 'redux-saga-promises'

function* toggleLikePostSaga(action) {
  try {
            const {success, failed}  = action;
            const { postId, likeableType, occasionId } = action.payload;
            const result = yield call(
              authSaga,
              toggleLike,
              {
                likeableId: postId,
                likeableType
              },
              occasionId
            );
        
            if (isValidResult(result)) {
              yield* success(result);
            }

  } catch (error) {
            yield* failed(error)
  }
}


const watchers = [
             {
                type:TOGGLE_LIKE_POST,
                listner:toggleLikePostSaga
              },

       ]


export default function* watcher(){
  yield* createWatchers(watchers);
}

```

### createWatchers (function)
##### accpets an array of object, where each object contains a `type` ie. the action to wait for and  `listner` ie. a generator function which will be called when the action is dispatched.
##
##### createWatchers provide two extra generator functions in the action prop received by the listner functions
##### 1. success
##### 2. failed

### success ( generator function)
##### it accepts two parameters `data` and `options`.
##### whenever this function is invoked it  automatically dispatches an `${ACTION_TYPE}_SUCCESS` action along with the data in the payload of the action. ie the action would look like 
##### {type: `${ACTION_TYPE}_SUCCESS`, payload: `data`}

###
##
| Options | description  | required  |
| :---:   | :-: | :-: |
| data | any thing to pass in the payload of the action | false |
| option |  {`type`: a different action type to dispatch  other than from which the listner function was invoked when the success function is called,  `moreAction`: an another action to dispatch after the `${ACTION_TYPE}_SUCCESS` action. eg {type: 'ACTIVATE_ALERT'} } | false |



### failed ( generator function)
##### it accepts two parameters `error` and `options`.
##### whenever this function is invoked it  automatically dispatches an `${ACTION_TYPE}_FAILED` action along with the error in the payload of the action. ie the action would look like 
##### {type: `${ACTION_TYPE}_FAILED`,  error: `error`}

###
##
| Options | description  | required  |
| :---:   | :-: | :-: |
| data | any thing to pass in the payload of the action | false |
| option |  {`type`: a different action type to dispatch other than from which the listner function was invoked when the failed function is called,  `moreAction`: an another action to dispatch after the `${ACTION_TYPE}_FAILED` action. eg {type: 'ACTIVATE_ALERT'} } | false |

# Defining Reducer

```javascript
import TOGGLE_LIKE_POST  from '../actionTypes'

const reducer = (store, action) { 
    
    switch(action.type){
        
        case `${TOGGLE_LIKE_POST}_SUCCESS`: //  rest of code
        case `${TOGGLE_LIKE_POST}_FAILED`: //  rest of code
        default: return store;
    }
    
}
```

# Waiting for the saga action requests

```javascript
import React from 'react';
import {waitForSagaAction} from 'redux-saga-promises'

class Like extends react.Component{

    constructor(props){
        super(props);
        this.state={
            isLoading: false
        }
    }
    
    likePost = async () => {
        try{
            this.toogleLoading();
             const result = await waitForSagaAction({type:TOGGLE_LIKE_POST});
        // result will receive the same data which was passed while calling 
        //  yield* success(data)
              this.toogleLoading();
        }catch(err){
           // err will receive the same error which was passed while calling 
          //  yield* failed(error)
             this.toogleLoading();
        }
    }
    
    
      toogleLoading = () => {
        this.setState((prevState) => ({
            isLoading: !prevState.isLoading
        }))
    }

    render(){
    const {isLoading} = this.state;
        return(
         <button onClick={this.likePost}>Like Post</button>
          {isLoading && <Loader />}
        )
    }
}

```