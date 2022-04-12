export type User = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

type InitialRequestState<T> = {
  onGoing: boolean;
  success: boolean;
  errors: string[];
  value?: T;
};

type CommonInit = {
  sessionId: string;
  handle: string;
  turbinePower: number;
  turbineCount: number;
};

export type ApiInit = CommonInit & {
  minDate: string;
  maxDate: string;
};

export type Init = CommonInit & {
  minDate: Date;
  maxDate: Date;
};

export type Turbine = {
  name: string;
  instantPower: number | null;
  windSpeed: number | null;
  disponibility: number | null;
  totalProduction: number | null;
};

export type Status = Turbine[];

type ProductibleValue = {
  name: string;
  value: number;
};

export type MonthlyData = {
  productibles: ProductibleValue[];
  labels: string[];
  values: number[];
  goals: number[];
  ratio: number;
  production: number;
};

type DailyDatum = {
  name: string;
  labels: string[];
  power: number[];
  windSpeed: number[];
};

export type DailyData = DailyDatum[];

export type YearlyData = {
  labels: string[];
  values: number[];
  goals: number[];
};

export type InitState = InitialRequestState<Init>;
export type StatusState = InitialRequestState<Status>;
export type DailyDataState = InitialRequestState<DailyData>;
export type MonthlyDataState = InitialRequestState<MonthlyData>;
export type YearlyDataState = InitialRequestState<YearlyData>;

export type WindFarmState = {
  init: InitState;
  status: StatusState;
  monthlyData: MonthlyDataState;
  dailyData: DailyDataState;
  yearlyData: YearlyDataState;
};

export type UserState = {
  initializing: boolean;
  initialized: boolean;
  loading: boolean;
  current?: User;
  forgottenPasswordAsking: boolean;
  forgottenPasswordAsked: boolean;
  passwordUpdating: boolean;
  passwordUpdated: boolean;
  errors: string[];
};

export type RootState = {
  windFarm: WindFarmState;
  user: UserState;
};

export type ResponseGenerator = {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
};

export type CustomLocation = {
  state: {
    from?: Location;
  };
};
