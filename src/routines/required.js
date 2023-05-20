import {panic} from "./panic.js";

export function required (val) {
   if (typeof val === 'undefined')
       panic(`Value required!`)
}

