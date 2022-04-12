import { format as fnsFormat, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

export const format = (date: Date, formatStr: string) => fnsFormat(date, formatStr, { locale: fr });

export const formatDate = (date: Date) => format(date, 'dd/MM/yyyy');

export const parseApiDate = (apiDate: string): Date => parse(apiDate, 'yyyy-MM-dd', new Date());
