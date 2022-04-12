import { call, put, select, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import * as api from '../api';
import { getErrors } from './utils';
import { parseApiDate } from '../utils/date';
import {
  ApiInit,
  DailyData,
  MonthlyData,
  ResponseGenerator,
  RootState,
  Status,
  Turbine,
  WindFarmState,
  YearlyData,
} from '../types';

export const INIT_START = 'WIND_FARM_INIT_START';
export const INIT_SUCCESS = 'WIND_FARM_INIT_SUCCESS';
export const INIT_ERROR = 'WIND_FARM_INIT_ERROR';

export const GET_STATUS_START = 'WIND_FARM_GET_STATUS_START';
export const GET_STATUS_SUCCESS = 'WIND_FARM_GET_STATUS_SUCCESS';
export const GET_STATUS_ERROR = 'WIND_FARM_GET_STATUS_ERROR';

export const MONTHLY_DATA_START = 'WIND_FARM_MONTHLY_DATA_START';
export const MONTHLY_DATA_SUCCESS = 'WIND_FARM_MONTHLY_DATA_SUCCESS';
export const MONTHLY_DATA_ERROR = 'WIND_FARM_MONTHLY_DATA_ERROR';

export const DAILY_DATA_START = 'WIND_FARM_DAILY_DATA_START';
export const DAILY_DATA_SUCCESS = 'WIND_FARM_DAILY_DATA_SUCCESS';
export const DAILY_DATA_ERROR = 'WIND_FARM_DAILY_DATA_ERROR';

export const YEARLY_DATA_START = 'WIND_FARM_YEARLY_DATA_START';
export const YEARLY_DATA_SUCCESS = 'WIND_FARM_YEARLY_DATA_SUCCESS';
export const YEARLY_DATA_ERROR = 'WIND_FARM_YEARLY_DATA_ERROR';

export const initialize = () => ({ type: INIT_START });
export const initialized = (data: ApiInit) => ({ type: INIT_SUCCESS, payload: data });
export const setInitErrors = (errors: string[]) => ({ type: INIT_ERROR, payload: errors });

export const getStatus = () => ({ type: GET_STATUS_START });
export const updateStatus = (data: Status) => ({ type: GET_STATUS_SUCCESS, payload: data });
export const setGetStatusErrors = (errors: string[]) => ({
  type: GET_STATUS_ERROR,
  payload: errors,
});

export const getMonthlyData = (day: Date) => ({ type: MONTHLY_DATA_START, payload: { day } });
export const updateMonthlyData = (data: MonthlyData) => ({
  type: MONTHLY_DATA_SUCCESS,
  payload: data,
});
export const setMonthlyDataErrors = (errors: string[]) => ({
  type: MONTHLY_DATA_ERROR,
  payload: errors,
});

export const getDailyData = (day: Date) => ({ type: DAILY_DATA_START, payload: { day } });
export const updateDailyData = (data: DailyData) => ({ type: DAILY_DATA_SUCCESS, payload: data });
export const setDailyDataErrors = (errors: string[]) => ({
  type: DAILY_DATA_ERROR,
  payload: errors,
});

export const getYearlyData = (startDate: Date, endDate: Date) => ({
  type: YEARLY_DATA_START,
  payload: { startDate, endDate },
});
export const updateYearlyData = (data: YearlyData) => ({
  type: YEARLY_DATA_SUCCESS,
  payload: data,
});
export const setYearlyDataErrors = (errors: string[]) => ({
  type: YEARLY_DATA_ERROR,
  payload: errors,
});

export const getSessionId = (state: RootState) => state.windFarm.init.value?.sessionId;
export const getHandle = (state: RootState) => state.windFarm.init.value?.handle;

export function* initializeSaga() {
  try {
    const response: ResponseGenerator = yield call(api.windFarm.initialize);
    yield put(initialized(response.data));
  } catch (error) {
    yield put(setInitErrors(getErrors(error)));
  }
}

export function* statusSaga() {
  try {
    const sessionId: string = yield select(getSessionId);
    const handle: string = yield select(getHandle);
    const response: ResponseGenerator = yield call(api.windFarm.status, sessionId, handle);
    yield put(updateStatus(response.data));
  } catch (error) {
    yield put(setGetStatusErrors(getErrors(error)));
  }
}

type DailyMonthlyDataSageParams = {
  payload: {
    day: Date;
  };
};

export function* monthlyDataSaga({ payload: { day } }: DailyMonthlyDataSageParams) {
  try {
    const response: ResponseGenerator = yield call(api.windFarm.monthlyData, day);
    yield put(updateMonthlyData(response.data));
  } catch (error) {
    yield put(setMonthlyDataErrors(getErrors(error)));
  }
}

export function* dailyDataSaga({ payload: { day } }: DailyMonthlyDataSageParams) {
  try {
    const sessionId: string = yield select(getSessionId);
    const response: ResponseGenerator = yield call(api.windFarm.dailyData, sessionId, day);
    yield put(updateDailyData(response.data));
  } catch (error) {
    yield put(setDailyDataErrors(getErrors(error)));
  }
}

type YearlyDataSageParams = {
  payload: {
    startDate: Date;
    endDate: Date;
  };
};

export function* yearlyDataSaga({ payload: { startDate, endDate } }: YearlyDataSageParams) {
  try {
    const sessionId: string = yield select(getSessionId);
    const response: ResponseGenerator = yield call(
      api.windFarm.yearlyData,
      sessionId,
      startDate,
      endDate,
    );
    yield put(updateYearlyData(response.data));
  } catch (error) {
    yield put(setYearlyDataErrors(getErrors(error)));
  }
}

export function* sagas() {
  yield takeLatest(INIT_START, initializeSaga);
  yield takeLatest(GET_STATUS_START, statusSaga);
  // @ts-ignore
  yield takeLatest(MONTHLY_DATA_START, monthlyDataSaga);
  // @ts-ignore
  yield takeLatest(DAILY_DATA_START, dailyDataSaga);
  // @ts-ignore
  yield takeLatest(YEARLY_DATA_START, yearlyDataSaga);
}

// Reducers

const initialRequestState = {
  onGoing: false,
  success: false,
  errors: [],
  value: undefined,
};

export const initialState: WindFarmState = {
  init: initialRequestState,
  status: initialRequestState,
  monthlyData: initialRequestState,
  dailyData: initialRequestState,
  yearlyData: initialRequestState,
};

export const reducer = (
  state = initialState,
  action: AnyAction = { type: '', payload: undefined },
) => {
  const { payload } = action;

  switch (action.type) {
    case INIT_START:
      return {
        ...state,
        init: { ...initialRequestState, onGoing: true },
        status: initialRequestState,
      };
    case INIT_SUCCESS:
      return {
        ...state,
        init: {
          ...initialRequestState,
          success: true,
          value: {
            ...payload,
            minDate: parseApiDate(payload?.minDate),
            maxDate: parseApiDate(payload.maxDate),
          },
        },
      };
    case INIT_ERROR:
      return {
        ...state,
        init: {
          ...initialRequestState,
          errors: payload,
        },
      };
    case GET_STATUS_START:
      return {
        ...state,
        status: {
          ...state.status,
          onGoing: true,
          success: false,
          errors: [],
        },
      };
    case GET_STATUS_SUCCESS:
      return {
        ...state,
        status: {
          ...initialRequestState,
          success: true,
          value: state.status.value
            ? (state.status.value as Status).map((turbine: Turbine) => {
                const newTurbine: Partial<Turbine> = {};
                const apiTurbine =
                  payload.find((item: Turbine) => item.name === turbine.name) || {};
                (Object.keys(turbine) as (keyof Turbine)[]).forEach((key) => {
                  newTurbine[key] = apiTurbine[key] || turbine[key];
                });
                return newTurbine;
              })
            : payload,
        },
      };
    case GET_STATUS_ERROR:
      return {
        ...state,
        status: {
          ...initialRequestState,
          errors: payload,
        },
      };
    case MONTHLY_DATA_START:
      return {
        ...state,
        monthlyData: {
          ...state.monthlyData,
          onGoing: true,
          success: false,
          errors: [],
        },
      };
    case MONTHLY_DATA_SUCCESS:
      return {
        ...state,
        monthlyData: {
          ...initialRequestState,
          success: true,
          value: payload,
        },
      };
    case MONTHLY_DATA_ERROR:
      return {
        ...state,
        monthlyData: {
          ...initialRequestState,
          errors: payload,
        },
      };
    case DAILY_DATA_START:
      return {
        ...state,
        dailyData: {
          ...state.dailyData,
          onGoing: true,
          success: false,
          errors: [],
        },
      };
    case DAILY_DATA_SUCCESS:
      return {
        ...state,
        dailyData: {
          ...initialRequestState,
          success: true,
          value: payload,
        },
      };
    case DAILY_DATA_ERROR:
      return {
        ...state,
        dailyData: {
          ...initialRequestState,
          errors: payload,
        },
      };
    case YEARLY_DATA_START:
      return {
        ...state,
        yearlyData: {
          ...state.yearlyData,
          onGoing: true,
          success: false,
          errors: [],
        },
      };
    case YEARLY_DATA_SUCCESS:
      return {
        ...state,
        yearlyData: {
          ...initialRequestState,
          success: true,
          value: payload,
        },
      };
    case YEARLY_DATA_ERROR:
      return {
        ...state,
        yearlyData: {
          ...initialRequestState,
          errors: payload,
        },
      };
    default:
      return state;
  }
};
