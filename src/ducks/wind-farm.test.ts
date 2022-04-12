import axios from 'axios';

import * as duck from './wind-farm';
import { asMock } from '../tests/test-helpers';
import { Status, WindFarmState } from '../types';
import { parseApiDate } from '../utils/date';

jest.mock('axios');

const initValue = {
  sessionId: 'sessionId',
  handle: 'handle',
  minDate: '2022-04-12T15:29:23.143Z',
  maxDate: '2022-04-12T15:29:23.143Z',
  turbinePower: 2400,
  turbineCount: 5,
};
const errors = ['errors'];
const status: Status = [
  {
    name: 'E1',
    instantPower: 1,
    windSpeed: 2,
    disponibility: 3,
    totalProduction: 4,
  },
];

describe('wind farm duck', () => {
  afterEach(() => {
    asMock(axios.post).mockClear();
  });

  describe('reducers', () => {
    const initializingState: WindFarmState = {
      ...duck.initialState,
      init: {
        ...duck.initialState.init,
        onGoing: true,
      },
    };

    const intializedState: WindFarmState = {
      ...duck.initialState,
      init: {
        ...duck.initialState.init,
        success: true,
        value: {
          ...initValue,
          minDate: parseApiDate(initValue.minDate),
          maxDate: parseApiDate(initValue.maxDate),
        },
      },
    };

    it('handles initialize action', () => {
      expect(duck.reducer(duck.initialState, duck.initialize())).toEqual(initializingState);
    });

    it('handles initialized action', () => {
      expect(JSON.stringify(duck.reducer(initializingState, duck.initialized(initValue)))).toEqual(
        JSON.stringify(intializedState),
      );
    });

    describe('updateStatus', () => {
      const initializedStatus = {
        ...intializedState,
        status: {
          ...initializingState.status,
          success: true,
          value: status,
        },
      };
      it('correctly update status for the first time', () => {
        expect(duck.reducer(intializedState, duck.updateStatus(status))).toEqual(initializedStatus);
      });

      it('correctly partially update status for the second time', () => {
        const newStatus = [{ ...status[0], instantPower: 10, windSpeed: null }];
        expect(duck.reducer(initializedStatus, duck.updateStatus(newStatus))).toEqual({
          ...initializedStatus,
          status: {
            ...initializedStatus.status,
            value: [
              {
                ...status[0],
                instantPower: 10,
              },
            ],
          },
        });
      });
    });

    it('handles setErrors action', () => {
      expect(duck.reducer(initializingState, duck.setInitErrors(errors))).toEqual({
        ...duck.initialState,
        init: {
          ...duck.initialState.init,
          errors,
        },
      });
    });
  });
});
