import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {inViewport} from "../../routines/in-viewport.js";
import {Registry} from "../../core/registry.js";
import {numberFormat} from "../../routines/number-format.js";

let CounterDefaultOptions = {
    prefix: "",
    suffix: "",
    duration: 3000,
    startOnViewport: true,
}

export class Counter extends Component {
    started = false
    from = null
    to = null
    constructor(elem, options) {
        if (typeof globalThis["metroCounterSetup"] !== "undefined") {
            CounterDefaultOptions = merge({}, CounterDefaultOptions, globalThis["metroCounterSetup"])
        }
        super(elem, "counter", merge({}, CounterDefaultOptions, options));
        this.createStruct()
        this.createEvents()
        this.run()
    }

    createStruct(){
        const element = this.element
        const [a, b] = element.text().split(",")
        this.from = b ? a : 0
        this.to = b ? b : a
        element.clear()
    }

    createEvents(){
        const element = this.element, o = this.options

        $(window).on("scroll", () => {
            if (o.startOnViewport === true && inViewport(element[0]) && !this.started) {
                this.run();
            }
        }, {ns: this.id})
    }

    run(){
        const elem = this.elem, o = this.options

        if (!inViewport(this.elem) || this.started) return

        this.started = true

        Animation.animate({
            el: this.elem,
            draw: {
                innerHTML: [this.from, this.to],
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