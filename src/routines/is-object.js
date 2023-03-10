import {isType} from "./is-type.js";

export const isObject = item => (item && typeof item === 'object' && !Array.isArray(item))
export const isObjectType = item => isType(item, "object")