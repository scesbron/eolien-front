// eslint-disable-next-line import/prefer-default-export,no-restricted-globals
export const formatCurrency = (amount) => (isNaN(amount) ? undefined : `${Number(amount)}\xa0€`);
