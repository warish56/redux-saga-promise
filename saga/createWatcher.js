import { put, takeLatest, call,all } from 'redux-saga/effects';

import {configuration} from '../config'


const generateErrorAction = (type,error,isForced) => {
  return {
    type: isForced ? type: `${type}_FAILED`,
    error,
  }
  }
  
  const generateSuccessAction = (type,data,isForced) => {
    return {
      type: isForced ? type: `${type}_SUCCESS`,
      payload:data
    }
    }
  
  
  
    const  successListner = (recivedType,callback) =>{
  
      return function* success(data, options={ type:'', moreAction:'' }){
         /**
         * @Params
         * data: an object 
         * 
         * options?: { 
         *   type?: actionType other than source actionType
         *   alertMessage?: if message is given then an alert will be displayed 
         *  }
         * 
         */
        yield call(callback, true,data)
        yield put(generateSuccessAction(options.type || recivedType, data, options.type))
       

        if(options.moreAction || configuration.successActionType){
        yield put(options.moreAction || configuration.successActionType);
        }

      }
  
    }
  
    const  failListner = (recivedType,callback) =>{
  
      return function* failed(err,options={ type:'', moreAction: '' }){
        /**
         * @Params
         * data: an object 
         * 
         * options?: { 
         *   type?: actionType other than source actionType
         *   alertMessage?: if message is given then an alert will be displayed 
         *  }
         * 
         */
        yield call(callback, false,err);
        yield put(generateErrorAction(options.type  || recivedType, err, options.type ))
       
        if(options.moreAction || configuration.failedActionType){
            yield put(options.moreAction || configuration.failedActionType);
        }

      }
  
    }
  
  function* createWatcher(watcher,action){
  
    const {type, payload,callback= () => {},...otherProps} = action;
  
  //  add success and failed callback functions to the action
    yield call(watcher.listner,
      { type,
        payload,
        success:successListner(type,callback),
        failed: failListner(type,callback),
        ...otherProps
      })
  
    
  }

  
 export default function* createWatcherList (watchers=[]){

  /**
   * @Params
   * watchers: an array of objects , 
   * [ {type: actionType , listner: saga listning for the action} ]
   */

  //  call all the watchers at once
  const arr = watchers.map((watcher) => {
       return  takeLatest(watcher.type,createWatcher,watcher)
    })
    yield all(arr);
  
  
  }