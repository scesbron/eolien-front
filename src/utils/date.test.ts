import { formatDate, parseApiDate } from './date';

describe('date', () => {
  describe('formatDate', () => {
    it('correctly format a date', () => {
      expect(formatDate(new Date(2020, 3, 13))).toEqual('13/04/2020');
    });
  });
  describe('parseApiDate', () => {
    it('correctly parse a date api string', () => {
      expect(parseApiDate('2020-04-13')).toEqual(new Date(2020, 3, 13));
    });
  });
});
