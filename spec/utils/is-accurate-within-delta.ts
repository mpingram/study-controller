const isAccurateWithinDelta = (actual: number, expected: number, delta?: number): boolean => {
  if (delta === undefined){
    delta = 100;
  }
  delta = Math.abs(delta);
  const upperBound = expected + delta;
  const lowerBound = expected - delta;
  return actual < upperBound && actual > lowerBound;
};

export default isAccurateWithinDelta;