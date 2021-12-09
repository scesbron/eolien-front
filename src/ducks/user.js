import { put, call, takeLatest } from 'redux-saga/effects';

import * as api from '../api';
import { getErrors } from './utils';
import { setAuthorization } from '../api';
import { parseApiDate } from '../utils/date';

// Constants

export const LOAD = 'USER_LOAD';
export const LOGIN = 'USER_LOGIN';
export const LOGOUT = 'USER_LOGOUT';
export const FORGOTTEN_PASSWORD = 'USER_FORGOTTEN_PASSWORD';
export const FORGOTTEN_PASSWORD_SUCCESS = 'USER_FORGOTTEN_PASSWORD_SUCCESS';
export const UPDATE_PASSWORD = 'USER_UPDATE_PASSWORD';
export const UPDATE_PASSWORD_SUCCESS = 'USER_UPDATE_PASSWORD_SUCCESS';
export const SET_ERRORS = 'USER_SET_ERRORS';
export const UPDATE = 'USER_UPDATE';
export const INITIALIZED = 'USER_INITIALIZED';

// Actions

export const logout = () => ({ type: LOGOUT });
export const login = (username, password, rememberMe) => (
  { type: LOGIN, payload: { username, password, rememberMe } }
);
export const forgottenPassword = (username) => (
  { type: FORGOTTEN_PASSWORD, payload: { username } }
);
export const updatePassword = (token, password, confirmation) => (
  { type: UPDATE_PASSWORD, payload: { token, password, confirmation } }
);
export const load = () => ({ type: LOAD });
export const updateUser = (user) => ({ type: UPDATE, payload: user });
export const setErrors = (errors) => ({ type: SET_ERRORS, payload: errors });
export const initialized = (user) => ({ type: INITIALIZED, payload: user });
export const forgottenPasswordSuccess = () => ({ type: FORGOTTEN_PASSWORD_SUCCESS });
export const updatePasswordSuccess = () => ({ type: UPDATE_PASSWORD_SUCCESS });

// Sagas

export function* logoutSaga() {
  try {
    yield call(api.session.delete);
    setAuthorization();
    yield put(updateUser());
  } catch (error) {
    yield put(setErrors(getErrors(error)));
  }
}

export function* loginSaga({ payload: { username, password, rememberMe } }) {
  try {
    const response = yield call(api.session.create, username, password);
    setAuthorization(response.headers.authorization, rememberMe);
    yield put(updateUser(response.data));
  } catch (error) {
    yield put(setErrors(getErrors(error)));
  }
}

export function* loadSaga() {
  try {
    const response = yield call(api.user.get);
    yield put(initialized(response.data));
  } catch (error) {
    setAuthorization();
    yield put(initialized());
  }
}

export function* forgottenPasswordSaga({ payload: { username } }) {
  try {
    yield call(api.password.create, username);
    yield put(forgottenPasswordSuccess());
  } catch (error) {
    yield put(setErrors(getErrors(error)));
  }
}

export function* updatePasswordSaga({ payload: { token, password, confirmation } }) {
  try {
    yield call(api.password.update, token, password, confirmation);
    yield put(updatePasswordSuccess());
  } catch (error) {
    yield put(setErrors(getErrors(error)));
  }
}

export function* sagas() {
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(LOGIN, loginSaga);
  yield takeLatest(LOAD, loadSaga);
  yield takeLatest(FORGOTTEN_PASSWORD, forgottenPasswordSaga);
  yield takeLatest(UPDATE_PASSWORD, updatePasswordSaga);
}

// Reducers

export const initialState = {
  initializing: false,
  initialized: false,
  loading: false,
  current: undefined,
  forgottenPasswordAsking: false,
  forgottenPasswordAsked: false,
  passwordUpdating: false,
  passwordUpdated: false,
  errors: [],
};

const convert = (user) => (!user ? undefined : {
  ...user,
  birthDate: parseApiDate(user.birthDate),
  loans: user.loans ? user.loans.map((loan) => ({
    ...loan,
    date: parseApiDate(loan.date),
  })) : user.loans,
  shares: user.shares ? user.shares.map((share) => ({
    ...share,
    date: parseApiDate(share.date),
  })) : user.shares,
});

export const reducer = (state = initialState, action) => {
  const { payload } = action;

  switch (action.type) {
    case LOAD:
      return { ...initialState, initializing: true };
    case LOGOUT:
      return { ...state, current: undefined };
    case LOGIN:
      return { ...state, loading: true };
    case FORGOTTEN_PASSWORD:
      return { ...state, forgottenPasswordAsking: true, forgottenPasswordAsked: false };
    case FORGOTTEN_PASSWORD_SUCCESS:
      return { ...state, forgottenPasswordAsking: false, forgottenPasswordAsked: true };
    case UPDATE_PASSWORD:
      return { ...state, passwordUpdating: true, passwordUpdated: false };
    case UPDATE_PASSWORD_SUCCESS:
      return { ...state, passwordUpdating: false, passwordUpdated: true };
    case UPDATE:
      return {
        ...state,
        loading: false,
        current: convert(payload),
        errors: [],
      };
    case INITIALIZED:
      return {
        ...state,
        initializing: false,
        initialized: true,
        current: convert(payload),
      };
    case SET_ERRORS:
      return {
        ...state,
        loading: false,
        forgottenPasswordAsking: false,
        passwordUpdating: false,
        current: undefined,
        errors: payload || [],
      };
    default:
      return state;
  }
};
