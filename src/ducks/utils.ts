export const getErrors = (error: any) => {
  if ('response' in error && error.response?.data?.errors) {
    return error.response.data.errors;
  }
  if ('message' in error) {
    return [error.message];
  }
  return [];
};
