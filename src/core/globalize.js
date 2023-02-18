import {datetime, Datetime} from "@olton/datetime";
import {str, Str} from "@olton/string";
import {$, query, Query} from "@olton/query";
import * as html from "@olton/html";
import Animation from "@olton/animation"
import Color from "@olton/color"

export const globalize = () => {
    globalThis.Color = Color
    globalThis.Animation = Animation
    globalThis.Datetime = Datetime
    globalThis.datetime = datetime
    globalThis.Str = Str
    globalThis.string = str
    globalThis.$ = $
    globalThis.Query = Query
    globalThis.query = query
    globalThis.html = {
        ...html
    }
    globalThis.__htmlSaver = {}
    globalThis.html.extract = (ctx = globalThis) => {
        for (let key in globalThis.html) {
            globalThis.__htmlSaver[key] = globalThis[key]
            ctx[key] = globalThis.html[key]
        }
    }

    globalThis.html.restore = (ctx = globalThis) => {
        for (let key in globalThis.__htmlSaver) {
            ctx[key] = globalThis.__htmlSaver[key]
        }
    }
}