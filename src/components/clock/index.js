import "./clock.css"
import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {noop} from "../../routines/noop.js";
import {Registry} from "../../core/registry.js";

let ClockDefaultOptions = {
    hidden: false,
    format: 24,
    onTick: noop,
    onSecond: noop,
    onMinute: noop,
    onHour: noop
}

export class Clock extends Component {
    tickInterval = null
    secondInterval = null
    time = null

    constructor(elem, options) {
        if (typeof globalThis["metroClockSetup"] !== "undefined") {
            ClockDefaultOptions = merge({}, ClockDefaultOptions, globalThis["metroClockSetup"])
        }
        super(elem, "clock", merge({}, ClockDefaultOptions, options));
        this.createStruct()
        this.tick()
        this.second()

        this.tickInterval = setInterval(()=>{
            this.tick()
        }, 500)

        this.secondInterval = setInterval(()=>{
            this.second()
        }, 1000)
    }

    createStruct(){
        const element = this.element, o = this.options

        if (o.hidden) {
            element.hide()
        }

        element.html(`
            <span class="hour">00</span>
            :
            <span class="minute">00</span>
            :
            <span class="second">00</span>
            <span class="ampm"></span>
        `)

        if (+(o.format) !== 12) {
            element.find(".ampm").hide()
        }
    }

    tick(){
        const element = this.element, o = this.options
        const timestamp = datetime()

        element.find(".hour").html(string(o.format === 24 ? timestamp.hour() : timestamp.hour12()).lpad('0', 2).value)
        element.find(".minute").html(string(timestamp.minute()).lpad('0', 2).value)
        element.find(".second").html(string(timestamp.second()).lpad('0', 2).value)
        element.find(".ampm").html(timestamp.hour()>=12 ? 'pm' : 'am')
    }

    second(){
        this.fireEvent("second", {
            time: this.time
        })
    }
}

Registry.register("clock", Clock)