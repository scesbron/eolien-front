import { runSaga } from 'redux-saga';
import axios from 'axios';

import * as duck from './user';
import { errorResponse, okResponse } from '../tests/test-helpers';
import { API_BASE_URL } from '../config';

const username = 'jdoe';
const password = 'password';
const errors = ['error'];
const user = { username, firstName: 'John', lastName: 'Doe' };

jest.mock('axios');

describe('users duck', () => {
  afterEach(() => {
    axios.post.mockClear();
  });

  describe('reducers', () => {
    it('handles LOGIN action', () => {
      expect(duck.reducer(duck.initialState, duck.login(username, password))).toEqual({
        ...duck.initialState,
        loading: true,
      });
    });
    it('handles LOGOUT action', () => {
      expect(duck.reducer({
        ...duck.initialState,
        current: user,
      }, duck.logout(username, password))).toEqual(duck.initialState);
    });
    it('handles LOAD action', () => {
      expect(duck.reducer(duck.initialState, duck.load())).toEqual({
        ...duck.initialState,
        initializing: true,
      });
    });
    it('handles INITIALIZED action without user', () => {
      expect(
        duck.reducer(duck.reducer(duck.initialState, duck.load()), duck.initialized()),
      ).toEqual({
        ...duck.initialState,
        initialized: true,
      });
    });
    it('handles INITIALIZED action with user', () => {
      expect(
        duck.reducer(duck.reducer(duck.initialState, duck.load()), duck.initialized(user)),
      ).toEqual({
        ...duck.initialState,
        initialized: true,
        current: user,
      });
    });
  });

  describe('sagas', () => {
    describe('loginSaga', () => {
      it('should call api and dispatch success action', async () => {
        const dispatched = [];
        axios.post.mockResolvedValue(okResponse(user));
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.loginSaga, duck.login(username, password));

        expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/login`, { user: { username, password } });
        expect(dispatched).toEqual([duck.updateUser(user)]);
      });

      it('should call api and dispatch error action from response error', async () => {
        const dispatched = [];
        axios.post.mockRejectedValue(errorResponse(422, errors));
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.loginSaga, duck.login(username, password));

        expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/login`, { user: { username, password } });
        expect(dispatched).toEqual([duck.setErrors(errors)]);
      });

      it('should call api and dispatch error action from network error', async () => {
        const dispatched = [];
        axios.post.mockRejectedValue(new Error('Network error'));
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.loginSaga, duck.login(username, password));

        expect(axios.post).toHaveBeenCalledWith(`${API_BASE_URL}/login`, { user: { username, password } });
        expect(dispatched).toEqual([duck.setErrors(['Network error'])]);
      });
    });

    describe('logoutSaga', () => {
      it('should call api and dispatch success action', async () => {
        const dispatched = [];
        axios.delete.mockResolvedValue(okResponse());
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.logoutSaga, duck.logout(user));

        expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/logout`);
        expect(dispatched).toEqual([duck.updateUser()]);
      });

      it('should call api and dispatch error action from response error', async () => {
        const dispatched = [];
        axios.delete.mockRejectedValue(errorResponse(422, errors));
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.logoutSaga, duck.logout(user));

        expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/logout`);
        expect(dispatched).toEqual([duck.setErrors(errors)]);
      });

      it('should call api and dispatch error action from network error', async () => {
        const dispatched = [];
        axios.delete.mockRejectedValue(new Error('Network error'));
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.logoutSaga, duck.logout(user));

        expect(axios.delete).toHaveBeenCalledWith(`${API_BASE_URL}/logout`);
        expect(dispatched).toEqual([duck.setErrors(['Network error'])]);
      });
    });

    describe('loadSaga', () => {
      it('should call api and dispatch success action', async () => {
        const dispatched = [];
        axios.get.mockResolvedValue(okResponse(user));
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.loadSaga, duck.load());

        expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/user`);
        expect(dispatched).toEqual([duck.initialized(user)]);
      });

      it('should call api and dispatch error action from response error', async () => {
        const dispatched = [];
        axios.get.mockRejectedValue(errorResponse(401, errors));
        await runSaga({
          dispatch: (action) => dispatched.push(action),
        }, duck.loadSaga, duck.load());

        expect(axios.get).toHaveBeenCalledWith(`${API_BASE_URL}/user`);
        expect(dispatched).toEqual([duck.initialized()]);
      });
    });
  });
});
