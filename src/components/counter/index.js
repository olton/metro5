import {Component} from "../../core/component.js";
import {merge} from "../../routines/merge.js";
import {inViewport} from "../../routines/in-viewport.js";
import {Registry} from "../../core/registry.js";
import {numberFormat} from "../../routines/number-format.js";
import {undef} from "../../routines/undef.js";

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
        this.from = undef(b) ? 0 : +a
        this.to = undef(b) ? +a : +b
        element.clear()
    }

    createEvents(){
        const element = this.element, o = this.options

        $(window).on("scroll", () => {
            if (!this.started && o.startOnViewport === true && inViewport(element[0])) {
                this.run();
            }
        }, {ns: this.id})
    }

    run(){
        const elem = this.elem, o = this.options

        if (this.started) return
        if (!inViewport(this.elem)) return

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