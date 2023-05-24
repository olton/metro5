import {panic} from "./panic.js";

export function required (val, msg = "Value required!") {
   if (typeof val === 'undefined')
       panic(msg)
}

