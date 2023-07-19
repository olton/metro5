import "./analog-clock.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {Registry} from "../../core/registry.js";

let AnalogClockDefaultOptions = {
    size: 100
}

export class AnalogClock extends Component {
    tickInterval = null
    constructor(elem, options) {
        if (typeof globalThis["metroAnalogClockSetup"] !== "undefined") {
            AnalogClockDefaultOptions = merge({}, AnalogClockDefaultOptions, globalThis["metroAnalogClockSetup"])
        }
        super(elem, "analogclock", merge({}, AnalogClockDefaultOptions, options));
        this.createStruct()
        this.createEvents()
    }

    createStruct(){
        const element = this.element, o = this.options
        element.addClass("analog-clock").css({
            width: o.size,
            height: o.size
        })
        element.html(`
            <div class="analog-clock__m12-6"></div>
            <div class="analog-clock__m3-9"></div>
            <div class="analog-clock__m1-7"></div>
            <div class="analog-clock__m2-8"></div>
            <div class="analog-clock__m4-10"></div>
            <div class="analog-clock__m5-11"></div>
            <div class="analog-clock__inner"></div>
            <div class="analog-clock__dot"></div>
            <div class="analog-clock__hour"></div>
            <div class="analog-clock__minute"></div>
            <div class="analog-clock__second"></div>
        `)
        this.tick()
        this.tickInterval = setInterval(()=>{
            this.tick()
        }, 1000)
    }
    createEvents(){}

    tick(){
        const element = this.element

        const d = new Date(); //object of date()
        const hr = d.getHours();
        const min = d.getMinutes();
        const sec = d.getSeconds();
        const hr_rotation = 30 * hr + min / 2; //converting current time
        const min_rotation = 6 * min;
        const sec_rotation = 6 * sec;

        element.find(".analog-clock__hour")[0].style.transform = `rotate(${hr_rotation}deg)`;
        element.find(".analog-clock__minute")[0].style.transform = `rotate(${min_rotation}deg)`;
        element.find(".analog-clock__second")[0].style.transform = `rotate(${sec_rotation}deg)`;
    }
}

Registry.register("analogclock", AnalogClock)