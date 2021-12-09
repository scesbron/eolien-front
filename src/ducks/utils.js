// eslint-disable-next-line import/prefer-default-export
export const getErrors = (error) => {
  if (error.response && error.response.data && error.response.data.errors) {
    return error.response.data.errors;
  }
  return [error.message];
};
