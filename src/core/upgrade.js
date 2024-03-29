import {Query} from "@olton/query";
import {exec, panic} from "../routines/index.js";

export const upgradeDatetime = (locales) => {
    Datetime.getLocale = function(locale = "en-US"){
        let data;

        if (!locales[locale]) {
            locale = "en-US";
        }

        data = locales[locale]['calendar'];

        return {
            months: data.months.filter( function(el, i){ return i < 12} ),
            monthsShort: data.months.filter( function(el, i){ return i > 11} ),
            weekdays: data.days.filter( function(el, i){ return i < 7} ),
            weekdaysShort: data.days.filter( function(el, i){ return i > 13} ),
            weekdaysMin: data.days.filter( function(el, i){ return i > 6 && i < 14} ),
            weekStart: data.weekStart
        }
    }
}

export const upgradeQuery = () => {
    Query.prototype.plugin = function(name){
        if (!name) {
            panic(`Plugin name required!`)
        }
        return Metro5.getPlugin(this[0], name)
    }

    Query.prototype.animate = function ({draw = {}, dur = 100, ease = "linear"} = {}, cb){
        return this.each((_, el)=>{
            Animation.animate({
                el,
                draw,
                dur,
                ease,
                onDone: () => {
                    exec(cb, [el], el)
                }
            })
        })
    }
}