import { getNewPositionsToClient, getRandomInt, isStickyInTrashZone } from '.';

describe('Utils File', () => {
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
    it('should return false in case the element is outside trash zone', () => {
      expect(
        isStickyInTrashZone(300, 300, {
          width: 1000,
          height: 800,
        }),
      ).toBeFalsy();
    });

    it('should return true in case the element is outside trash zone', () => {
      expect(
        isStickyInTrashZone(800, 600, {
          width: 1000,
          height: 800,
        }),
      ).toBeTruthy();
    });
  });

  describe('getNewPositionsToClient', () => {
    it('should return position from event if element is inside container', () => {
      const { translateX, translateY } = getNewPositionsToClient({
        clientEvent: {
          clientX: 600,
          clientY: 200,
        },
        containerDimensions: {
          width: 1200,
          height: 800,
        },
        elementDimensions: {
          width: 250,
          height: 250,
        },
        dragProps: {
          dragStartLeft: 450,
          dragStartTop: 200,
          dragStartX: 500,
          dragStartY: 200,
        },
      });

      expect(translateX).toBe(550);
      expect(translateY).toBe(200);
    });

    it('should return position from container in case dragging outside', () => {
      const { translateX, translateY } = getNewPositionsToClient({
        clientEvent: {
          clientX: 1000,
          clientY: 800,
        },
        containerDimensions: {
          width: 1200,
          height: 800,
        },
        elementDimensions: {
          width: 250,
          height: 250,
        },
        dragProps: {
          dragStartLeft: 450,
          dragStartTop: 200,
          dragStartX: 500,
          dragStartY: 200,
        },
      });

      expect(translateX).toBe(950);
      expect(translateY).toBe(550);
    });
  });
});
