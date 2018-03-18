import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer } from 'redux-connect';

import { IStore } from './models';
console.log(1);
const rootReducer: Redux.Reducer<IStore> = combineReducers<IStore>({
  routing: routerReducer,
  reduxAsyncConnect: reducer,
});

export default rootReducer;
