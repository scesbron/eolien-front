const defaultResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  config: {},
  headers: {},
};

export const okResponse = <T>(data?: T) => ({
  ...defaultResponse,
  data,
});

export const errorResponse = (status: number, errors: string[]) => ({
  isAxiosError: true,
  response: {
    ...defaultResponse,
    data: { errors },
    status,
  },
});

type MockableFunction = (...args: any[]) => any;

// use generic constraints to restrict `mockedFunc` to be any type of function
export const asMock = <Func extends MockableFunction>(mockedFunc: Func) =>
  mockedFunc as jest.MockedFunction<typeof mockedFunc>;
