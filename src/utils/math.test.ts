import { sum } from './math';

describe('math', () => {
  describe('sum', () => {
    it('returns 0 for an empty array', () => {
      expect(sum([])).toEqual(0);
    });
    it('returns the correct sum for an array with values', () => {
      expect(sum([3, 5, 12])).toEqual(20);
    });
  });
});
