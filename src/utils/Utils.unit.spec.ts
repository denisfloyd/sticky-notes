import { getRandomInt, isStickyInTrashZone } from '.';

describe('Utils', () => {
  describe('getRandomInt', () => {
    it('should generate random number between 0 and 1', () => {
      const randomNumber = getRandomInt(0, 1);

      expect(randomNumber).toBeGreaterThanOrEqual(0);
      expect(randomNumber).toBeLessThanOrEqual(1);
    });

    it('should not generate number outside range', () => {
      const randomNumber = getRandomInt(5, 10);

      expect(randomNumber).not.toBeLessThan(5);
      expect(randomNumber).not.toBeGreaterThan(10);
    });
  });

  describe('isStickyInTrashZone', () => {
    it('should return false in case the element is outsize trash zone', () => {
      expect(
        isStickyInTrashZone(300, 300, {
          width: 1000,
          height: 800,
        }),
      ).toBeFalsy();
    });

    it('should return true in case the element is outsize trash zone', () => {
      expect(
        isStickyInTrashZone(800, 600, {
          width: 1000,
          height: 800,
        }),
      ).toBeTruthy();
    });
  });
});
