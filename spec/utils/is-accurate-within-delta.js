"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAccurateWithinDelta = (actual, expected, delta) => {
    if (delta === undefined) {
        delta = 100;
    }
    delta = Math.abs(delta);
    const upperBound = expected + delta;
    const lowerBound = expected - delta;
    return actual < upperBound && actual > lowerBound;
};
exports.default = isAccurateWithinDelta;
