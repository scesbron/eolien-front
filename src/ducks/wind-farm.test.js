import axios from 'axios';

import * as duck from './wind-farm';

jest.mock('axios');

const sessionId = 'sessionId';
const handle = 'handle';
const errors = ['errors'];
const status = [{
  name: 'E1',
  instantPower: 1,
  windSpeed: 2,
  disponibility: 3,
  totalProduction: 4,
}];

describe('wind farm duck', () => {
  afterEach(() => {
    axios.post.mockClear();
  });

  describe('reducers', () => {
    const initializingState = {
      ...duck.initialState,
      initializing: true,
    };

    const intializedState = {
      ...duck.initialState,
      initialized: true,
      sessionId,
      handle,
    };

    it('handles initialize action', () => {
      expect(duck.reducer(duck.initialState, duck.initialize())).toEqual(initializingState);
    });

    it('handles initialized action', () => {
      expect(
        duck.reducer(initializingState, duck.initialized({ sessionId, handle })),
      ).toEqual(
        intializedState,
      );
    });

    describe('updateStatus', () => {
      it('correctly update status for the first time', () => {
        expect(
          duck.reducer(intializedState, duck.updateStatus(status)),
        ).toEqual({
          ...intializedState,
          status,
        });
      });

      it('correctly partially update status for the second time', () => {
        const newStatus = [{ name: 'E1', instantPower: 10, windSpeed: null }];
        expect(
          duck.reducer({ ...intializedState, status }, duck.updateStatus(newStatus)),
        ).toEqual({
          ...intializedState,
          status: [{
            ...status[0],
            instantPower: 10,
          }],
        });
      });
    });

    it('handles setErrors action', () => {
      expect(duck.reducer(initializingState, duck.setErrors(errors))).toEqual({
        ...duck.initialState,
        errors,
      });
    });
  });
});
