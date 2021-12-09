import {
  call, put, select, takeLatest,
} from 'redux-saga/effects';
import * as api from '../api';
import { getErrors } from './utils';
import { parseApiDate } from '../utils/date';

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
export const initialized = (data) => ({ type: INIT_SUCCESS, payload: data });
export const setInitErrors = (errors) => ({ type: INIT_ERROR, payload: errors });

export const getStatus = () => ({ type: GET_STATUS_START });
export const updateStatus = (data) => ({ type: GET_STATUS_SUCCESS, payload: data });
export const setGetStatusErrors = (errors) => ({ type: GET_STATUS_ERROR, payload: errors });

export const getMonthlyData = (day) => ({ type: MONTHLY_DATA_START, payload: { day } });
export const updateMonthlyData = (data) => ({ type: MONTHLY_DATA_SUCCESS, payload: data });
export const setMonthlyDataErrors = (errors) => ({ type: MONTHLY_DATA_ERROR, payload: errors });

export const getDailyData = (day) => ({ type: DAILY_DATA_START, payload: { day } });
export const updateDailyData = (data) => ({ type: DAILY_DATA_SUCCESS, payload: data });
export const setDailyDataErrors = (errors) => ({ type: DAILY_DATA_ERROR, payload: errors });

export const getYearlyData = (startDate, endDate) => ({ type: YEARLY_DATA_START, payload: { startDate, endDate } });
export const updateYearlyData = (data) => ({ type: YEARLY_DATA_SUCCESS, payload: data });
export const setYearlyDataErrors = (errors) => ({ type: YEARLY_DATA_ERROR, payload: errors });

export const getSessionId = (state) => state.windFarm.init.value.sessionId;
export const getHandle = (state) => state.windFarm.init.value.handle;

export function* initializeSaga() {
  try {
    const response = yield call(api.windFarm.initialize);
    yield put(initialized(response.data));
  } catch (error) {
    yield put(setInitErrors(getErrors(error)));
  }
}

export function* statusSaga() {
  try {
    const sessionId = yield select(getSessionId);
    const handle = yield select(getHandle);
    const response = yield call(api.windFarm.status, sessionId, handle);
    yield put(updateStatus(response.data));
  } catch (error) {
    yield put(setGetStatusErrors(getErrors(error)));
  }
}

export function* monthlyDataSaga({ payload: { day } }) {
  try {
    const response = yield call(api.windFarm.monthlyData, day);
    yield put(updateMonthlyData(response.data));
  } catch (error) {
    yield put(setMonthlyDataErrors(getErrors(error)));
  }
}

export function* dailyDataSaga({ payload: { day } }) {
  try {
    const sessionId = yield select(getSessionId);
    const response = yield call(api.windFarm.dailyData, sessionId, day);
    yield put(updateDailyData(response.data));
  } catch (error) {
    yield put(setDailyDataErrors(getErrors(error)));
  }
}

export function* yearlyDataSaga({ payload: { startDate, endDate } }) {
  try {
    const sessionId = yield select(getSessionId);
    const response = yield call(api.windFarm.yearlyData, sessionId, startDate, endDate);
    yield put(updateYearlyData(response.data));
  } catch (error) {
    yield put(setYearlyDataErrors(getErrors(error)));
  }
}

export function* sagas() {
  yield takeLatest(INIT_START, initializeSaga);
  yield takeLatest(GET_STATUS_START, statusSaga);
  yield takeLatest(MONTHLY_DATA_START, monthlyDataSaga);
  yield takeLatest(DAILY_DATA_START, dailyDataSaga);
  yield takeLatest(YEARLY_DATA_START, yearlyDataSaga);
}

// Reducers

const initialRequestState = {
  onGoing: false,
  success: false,
  errors: [],
  value: undefined,
};

export const initialState = {
  init: initialRequestState,
  status: initialRequestState,
  monthlyData: initialRequestState,
  dailyData: initialRequestState,
  yearlyData: initialRequestState,
};

export const reducer = (state = initialState, action) => {
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
            minDate: parseApiDate(payload.minDate),
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
          ...state.status, onGoing: true, success: false, errors: [],
        },
      };
    case GET_STATUS_SUCCESS:
      return {
        ...state,
        status: {
          ...initialRequestState,
          success: true,
          value: state.status.value ? state.status.value.map((turbine) => {
            const newTurbine = {};
            const apiTurbine = payload.find((item) => item.name === turbine.name) || {};
            Object.keys(turbine).forEach((key) => {
              newTurbine[key] = apiTurbine[key] || turbine[key];
            });
            return newTurbine;
          }) : payload,
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
          ...state.monthlyData, onGoing: true, success: false, errors: [],
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
          ...state.dailyData, onGoing: true, success: false, errors: [],
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
          ...state.yearlyData, onGoing: true, success: false, errors: [],
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
