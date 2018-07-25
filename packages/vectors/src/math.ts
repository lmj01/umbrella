export const PI = Math.PI;
export const TAU = PI * 2;
export const HALF_PI = PI / 2;
export const QUARTER_PI = PI / 2;

export const DEG2RAD = PI / 180;
export const RAD2DEG = 180 / PI;

export let EPS = 1e-6;

export const atan2Abs = (y: number, x: number) => {
    const theta = Math.atan2(y, x);
    return theta < 0 ? TAU + theta : theta;
};

/**
 * Converts angle to degrees.
 *
 * @param x angle in radians
 */
export const deg = (x: number) => x * RAD2DEG;

/**
 * Converts angle to radians.
 *
 * @param x angle in degrees
 */
export const rad = (x: number) => x * DEG2RAD;

/**
 * Checks if `|a - b| <= ε`.
 *
 * @param a left value
 * @param b right value
 * @param eps epsilon / tolerance
 */
export const eqDelta = (a: number, b: number, eps = EPS) => {
    const d = a - b;
    return (d * d) <= (eps * eps);
};

/**
 * Returns `a - b * n`
 *
 * @param a
 * @param b
 */
export const fmod = (a: number, b: number) => a - b * Math.floor(a / b);

/**
 * Linear interpolation: `a + (b - a) * t`.
 *
 * @param a start value
 * @param b end value
 * @param t interpolation factor (0.0 .. 1.0)
 */
export const mix = (a: number, b: number, t = 0.5) => a + (b - a) * t;

/**
 * Step/threshold function.
 *
 * @param edge threshold
 * @param x test value
 * @returns 0, if `x < e`, else 1
 */
export const step = (edge: number, x: number) => x < edge ? 0 : 1;

/**
 * GLSL-style smoothStep threshold function.
 *
 * @param edge lower threshold
 * @param edge2 upper threshold
 * @param x test value
 * @returns 0, if `x < edge1`, 1 if `x > edge2`, else sigmoid interpolation
 */
export const smoothStep = (edge: number, edge2: number, x: number) => {
    const t = clamp((x - edge) / (edge2 - edge), 0, 1);
    return (3 - 2 * t) * t * t;
};

export const min2id = (a, b) => a <= b ? 0 : 1;

export const min3id = (a, b, c) =>
    (a <= b) ?
        (a <= c ? 0 : 2) :
        (b <= c ? 1 : 2);

export const min4id = (a, b, c, d) =>
    a <= b ?
        (a <= c ?
            (a <= d ? 0 : 3) :
            (c <= d ? 2 : 3)) :
        (b <= c ?
            (b <= d ? 1 : 3) :
            (c <= d ? 2 : 3));

export const max2id = (a, b) => a >= b ? 0 : 1;

export const max3id = (a, b, c) =>
    (a >= b) ?
        (a >= c ? 0 : 2) :
        (b >= c ? 1 : 2);

export const max4id = (a, b, c, d) =>
    a >= b ?
        (a >= c ?
            (a >= d ? 0 : 3) :
            (c >= d ? 2 : 3)) :
        (b >= c ?
            (b >= d ? 1 : 3) :
            (c >= d ? 2 : 3));

/**
 * Clamps value `x` to given closed interval.
 *
 * @param x value to clamp
 * @param min lower bound
 * @param max upper bound
 */
export const clamp = (x: number, min: number, max: number) =>
    x < min ? min : x > max ? max : x;

export const fit = (x: number, a: number, b: number, c: number, d: number) =>
    c + (d - c) * (x - a) / (b - a);

export const fitClamped = (x: number, a: number, b: number, c: number, d: number) =>
    c + (d - c) * clamp((x - a) / (b - a), 0, 1);

export const sign = (x: number, eps = EPS) =>
    x > eps ? 1 : x < -eps ? -1 : 0;

export const trunc = (x: number) =>
    x < 0 ? Math.ceil(x) : Math.floor(x);

export const roundTo = (x: number, prec = 1) =>
    Math.round(x / prec) * prec;

/**
 * Returns true iff `x` is in closed interval `[min .. max]`
 *
 * @param x
 * @param min
 * @param max
 */
export const inRange = (x: number, min: number, max: number) =>
    x >= min && x <= max;

/**
 * Returns true iff `x` is in open interval `(min .. max)`
 *
 * @param x
 * @param min
 * @param max
 */
export const inOpenRange = (x: number, min: number, max: number) =>
    x > min && x < max;
