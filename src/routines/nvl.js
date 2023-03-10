import {undef} from "./undef.js";

export const nvl = (val, ifNull) => undef(val) ? ifNull : val