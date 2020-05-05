
export const configuration = {
    successActionType: null, // requires an action {type: ACTION, ...otherProps}
    failedActionType: null, // requires an action {type: ACTION, ...otherProps}
}

export const store = null;

 const configureWatcher = (options) => {
   if(typeof options !== 'object'){
       return;
   }
   
   if(options.store){
       store = options.store;
   }

   if(option.successActionType){
     configuration.successActionType = option.successActionType ;
   }

   if(option.failedActionType){
     configuration.failedActionType = option.failedActionType;
   }
}

export default configureWatcher;