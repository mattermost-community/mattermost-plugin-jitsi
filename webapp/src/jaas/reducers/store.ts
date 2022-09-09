import {applyMiddleware, createStore, Store} from 'redux';
import thunk from 'redux-thunk';

import {loadInitialState, JaaSState} from '../util';
import combinedReducers from './reducer';

export function configureStore() : Store<JaaSState> {
    const initialState = loadInitialState();
    const store = createStore(combinedReducers, initialState, applyMiddleware(thunk));
    return store;
}

const store = configureStore();
export default store;
