import type { FnN2, IObjectOf, NumericArray } from "@thi.ng/api";
import { FloatFormat, FloatFormatSpec, Lane } from "../api";
import { luminanceABGR } from "../utils";

export const defFloatFormat = (fmt: FloatFormatSpec) => {
    const chan = fmt.channels;
    const chanShift = chan.reduce(
        (acc, ch) => ((acc[ch] = (3 - ch) << 3), acc),
        <IObjectOf<number>>{}
    );
    const res = <FloatFormat>{
        ...fmt,
        size: chan.length,
        shift: chanShift,
        __float: true,
    };
    if (fmt.convert) {
        Object.assign(res, fmt.convert);
        return res;
    }
    const to = (col: NumericArray, i: number) =>
        ((col[i] * 0xff + 0.5) | 0) << chanShift[chan[i]];
    const from: FnN2 = (col, i) => ((col >>> chanShift[chan[i]]) & 0xff) / 0xff;
    switch (chan.length) {
        case 1:
            if (fmt.gray) {
                res.toABGR = (col) =>
                    ((((col[0] * 0xff + 0.5) | 0) * 0x010101) | 0xff000000) >>>
                    0;
                res.fromABGR = (col, out = []) => (
                    (out[0] = luminanceABGR(col) / 0xff), out
                );
            } else {
                res.toABGR = (col) => {
                    let out = fmt.alpha ? 0 : 0xff000000;
                    out |= to(col, 0);
                    return out >>> 0;
                };
                res.fromABGR = (col, out = []) => {
                    out[0] = from(col, 0);
                    return out;
                };
            }
            break;
        case 2:
            if (fmt.gray) {
                const gray = ~~(chan[0] === Lane.ALPHA);
                const alpha = gray ^ 1;
                res.toABGR = (col) => {
                    let out = ((col[gray] * 0xff + 0.5) | 0) * 0x010101;
                    out |= ((col[alpha] * 0xff + 0.5) | 0) << 24;
                    return out >>> 0;
                };
                res.fromABGR = (col, out = []) => {
                    out[gray] = luminanceABGR(col) / 0xff;
                    out[alpha] = from(col, alpha);
                    return out;
                };
            } else {
                res.toABGR = (col) => {
                    let out = fmt.alpha ? 0 : 0xff000000;
                    out |= to(col, 0);
                    out |= to(col, 1);
                    return out >>> 0;
                };
                res.fromABGR = (col, out = []) => {
                    out[0] = from(col, 0);
                    out[1] = from(col, 1);
                    return out;
                };
            }
            break;
        case 3:
            res.toABGR = (col) => {
                let out = fmt.alpha ? 0 : 0xff000000;
                out |= to(col, 0);
                out |= to(col, 1);
                out |= to(col, 2);
                return out >>> 0;
            };
            res.fromABGR = (col, out = []) => {
                out[0] = from(col, 0);
                out[1] = from(col, 1);
                out[2] = from(col, 2);
                return out;
            };
            break;
        case 4:
            res.toABGR = (col) => {
                let out = fmt.alpha ? 0 : 0xff000000;
                out |= to(col, 0);
                out |= to(col, 1);
                out |= to(col, 2);
                out |= to(col, 3);
                return out >>> 0;
            };
            res.fromABGR = (col, out = []) => {
                out[0] = from(col, 0);
                out[1] = from(col, 1);
                out[2] = from(col, 2);
                out[3] = from(col, 3);
                return out;
            };
            break;
    }
    return res;
};