export const TrashZoneDimensions = {
  width: 400,
  height: 400,
}

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function isStickyInTrashZone(stickyX: number, stickyY: number, container: { width: number, height: number}) {
  return stickyX > container.width - TrashZoneDimensions.width && stickyY > container.height - TrashZoneDimensions.height;
}