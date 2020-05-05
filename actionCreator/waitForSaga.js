
import {store} from '../config'

export const waitForSagaAction = ({type, callback, ...otherProps}) => {
   
  return new Promise((resolve, reject) => {

     const onResolve = (data) => {
          resolve(data);
     }

     const onReject = (err) => {
      reject(err);
    }


    const callbackFunction = async (success = false, extraData) =>{

      if(success){
        onResolve(extraData)
      }else{
        onReject(extraData)
      }

      /* 
      returning promise to the saga so that the saga should wait for the callback to finish first then proceed to next line
      */
     
      return new Promise((resolve) => {
        resolve(true);
      })


    }


    store.dispatch({type, ...otherProps, callback:callbackFunction});
  })
}