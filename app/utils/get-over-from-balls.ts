const getOverFromBalls = (balls: number) =>
  Math.floor(balls / 6) + (balls % 6) / 10;

export { getOverFromBalls };
