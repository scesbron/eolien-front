const defaultResponse = {
  data: {},
  status: 200,
  statusText: 'OK',
  config: {},
  headers: {},
};

export const okResponse = (data) => ({
  ...defaultResponse,
  data,
});

export const errorResponse = (status, errors) => ({
  status,
  response: {
    ...defaultResponse,
    data: { errors },
    status,
  },
});
