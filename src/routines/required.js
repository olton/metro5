import {panic} from "./panic.js";

export function required (val, name, context) {
   if (typeof val === 'undefined' || val === null)
       panic(`Value required for "${name}" in "${context}"`)
}



