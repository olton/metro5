import {undef} from "./undef.js";
import {isTag} from "./is-tag.js";
import {isUrl} from "./is-url.js";

export const isType = (obj, type) => {
    if (undef(obj)) {
        return false;
    }

    if (typeof obj === type) {
        return obj;
    }

    const t = (""+type).toLowerCase()

    if (t === 'tag' && isTag(obj)) {
        return obj;
    }

    if (t === 'url' && isUrl(obj)) {
        return obj;
    }

    if (t === 'array' && Array.isArray(obj)) {
        return obj;
    }

    // ???
    // if (this.isTag(obj) || this.isUrl(obj)) {
    //     return false;
    // }

    if (typeof window[obj] === t) {
        return window[obj];
    }

    if (typeof obj === 'string' && !obj.includes(".")) {
        return false;
    }

    if (typeof obj === 'string' && /[/\s([]+/gm.test(obj)) {
        return false;
    }

    if (typeof obj === "number" && t !== "number") {
        return false;
    }

    const ns = obj.split(".");
    let context = window;

    for(let i = 0; i < ns.length; i++) {
        context = context[ns[i]];
    }

    return typeof context === t ? context : false;
}