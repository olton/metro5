import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {inViewport} from "../../routines/in-viewport.js";
import {Registry} from "../../core/registry.js";
import {numberFormat} from "../../routines/number-format.js";

let CounterDefaultOptions = {
    prefix: "",
    suffix: "",
    duration: 3000,
}

export class Counter extends Component {
    started = false
    target = null
    constructor(elem, options) {
        if (typeof globalThis["metroCounterSetup"] !== "undefined") {
            CounterDefaultOptions = merge({}, CounterDefaultOptions, globalThis["metroCounterSetup"])
        }
        super(elem, "counter", merge({}, CounterDefaultOptions, options));
        this.createStruct()
        this.run()
    }

    createStruct(){
        const element = this.element
        this.target = parseFloat(element.text())
        element.clear()
    }

    run(){
        const elem = this.elem, o = this.options

        if (!inViewport(this.elem) || this.started) return

        this.started = true

        Animation.animate({
            el: this.elem,
            draw: {
                innerHTML: [0, this.target],
                opacity: [0, 1]
            },
            dur: o.duration,
            onFrame: () => {
                elem.innerHTML = `${o.prefix} ${numberFormat(+elem.innerHTML)} ${o.suffix}`
            }
        })
    }
}

Registry.register("counter", Counter)