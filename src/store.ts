import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
// @ts-ignore
import logger from 'redux-logger';

import * as user from './ducks/user';

const rootReducer = combineReducers({
  user: user.reducer,
});

function* rootSaga() {
  yield fork(user.sagas);
}

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_ENABLE_REDUX_LOGGER) {
    middlewares.push(logger);
  }
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  sagaMiddleware.run(rootSaga);
  return store;
};

export const store = configureStore();
