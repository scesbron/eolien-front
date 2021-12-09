import { formatCurrency } from './currency';

describe('currency', () => {
  describe('formatCurrency', () => {
    it('correctly format a value', () => {
      expect(formatCurrency(100)).toEqual('100\xa0€');
    });
    it('correctly format a string number', () => {
      expect(formatCurrency('100')).toEqual('100\xa0€');
    });
    it('correctly format 0', () => {
      expect(formatCurrency(0)).toEqual('0\xa0€');
    });
    it('returns undefined for an undefined value', () => {
      expect(formatCurrency(undefined)).toBeUndefined();
    });
    it('returns undefined for an null value', () => {
      expect(formatCurrency(null)).toEqual('0\xa0€');
    });
  });
});
