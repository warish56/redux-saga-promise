import {waitForSagaAction} from './actionCreator/waitForSaga'
import createWatchers from './saga/createWatcher'
import configureWatcher from './config'


const root = {
    waitForSagaAction,
    createWatchers,
    configureWatcher
}

export default root;


