
export const configuration = {
    successActionType: null, // requires an action {type: ACTION, ...otherProps}
    failedActionType: null, // requires an action {type: ACTION, ...otherProps}
}

export let store = null;

 const configureWatcher = (options) => {
   if(typeof options !== 'object'){
       return;
   }
   
   if(options.store){
       store = options.store;
   }

   if(options.successActionType){
     configuration.successActionType = options.successActionType ;
   }

   if(options.failedActionType){
     configuration.failedActionType = options.failedActionType;
   }
}

export default configureWatcher;
