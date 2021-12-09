import { format as fnsFormat, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

export const format = (date, formatStr) => fnsFormat(date, formatStr, { locale: fr });

export const formatDate = (date) => format(date, 'dd/MM/yyyy');

export const parseApiDate = (apiDate) => (
  apiDate ? parse(apiDate, 'yyyy-MM-dd', new Date()) : apiDate
);
